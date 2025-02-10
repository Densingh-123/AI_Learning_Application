import { 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    ScrollView, 
    ActivityIndicator
} from 'react-native';
import React, { useContext, useState } from 'react';
import { GenerateCourseAiModel, GenerateTopicsAiModel } from '../config/AiModel';
import { FontAwesome } from '@expo/vector-icons';
import { doc, setDoc } from '@firebase/firestore';
import { UserDetailContext } from '../context/UserDetailContext';
import { useRouter } from 'expo-router';
import { db } from '../config/firebase';

const AddCourse = () => {
    const [userInput, setUserInput] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter();

    const onGenerateTopic = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        const PROMPT = `${userInput} ::As you are a coaching teacher \n - User wants to learn about the topic \n - Generate 18 short Course titles (max 18 characters each) \n - Make sure it is related to the description \n - Output will be an array of strings in JSON format only \n - Do not add any plain text in output`;
        
        try {
            const aiRes = await GenerateTopicsAiModel.sendMessage(PROMPT);
            const topicIdea = JSON.parse(aiRes.response.text());
            setTopics(topicIdea.course_titles || []);
        } catch (error) {
            console.error('Error generating topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const onGenerateCourse = async () => {
        if (selectedTopics.length === 0) return;
        setLoading(true);
        const PROMPT = `As you are a coaching teacher \n - User wants to learn about ${selectedTopics.join(', ')} \n - Create two courses with course name, description, and three chapters in each course \n - Include detailed explanations, code examples, and real-life scenarios \n - Generate quizzes, flashcards (fill-in-the-blanks), and Q&A for each chapter \n - Add a banner image from '/banner1.jpg' to '/banner10.jpg' \n - Output should be JSON format only without any plain text`;

        try {
            const aiRes = await GenerateCourseAiModel.sendMessage(PROMPT);
            const course = JSON.parse(aiRes.response.text());
            course?.forEach(async (courses) => {
                await setDoc(doc(db, 'Courses', Date.now().toString()), {
                    ...courses,
                    createdOn: new Date(),
                    createdBy: userDetail.email,
                });
            });
            router.push('/components/Home');
        } catch (error) {
            console.error('Error generating course:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopicSelection = (topic) => {
        setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.header}>Create New Course</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='(e.g., Learn Python, Learn Java, Learn Big Data)'
                    onChangeText={setUserInput}
                    value={userInput}
                    placeholderTextColor='#aaa'
                />
                <TouchableOpacity style={styles.generateButton} onPress={onGenerateTopic} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Generate Topics</Text>}
                </TouchableOpacity>
                
                {topics.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Select Topics</Text>
                        <View style={styles.topicContainer}>
                            {topics.map((item, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={[styles.topicItem, selectedTopics.includes(item) && styles.selectedTopic]}
                                    onPress={() => toggleTopicSelection(item)}
                                >
                                    <Text style={styles.topicText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
                
                {selectedTopics.length > 0 && (
                    <TouchableOpacity style={styles.generateButton} onPress={onGenerateCourse} disabled={loading}>
                        {loading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Generate Course</Text>}
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default AddCourse;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    container: {
        padding: 20,
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    generateButton: {
        backgroundColor: '#3498db',
        padding: 14,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#2c3e50',
    },
    topicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    topicItem: {
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 6,
        margin: 6,
    },
    selectedTopic: {
        backgroundColor: '#2980b9',
    },
    topicText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
