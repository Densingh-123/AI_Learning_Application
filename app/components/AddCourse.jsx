import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { GenerateTopicsAiModel } from '../config/AiModel';
import { FontAwesome } from '@expo/vector-icons';

const AddCourse = () => {
    const [userInput, setUserInput] = useState('');
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const onGenerateTopic = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        const PROMPT = `${userInput} ::As you are a coaching teacher \n - User wants to learn about the topic \n - Generate 18 short Course titles (max 18 characters each) \n - Make sure it is related to the description \n - Output will be an array of strings in JSON format only \n - Do not add any plain text in output`;
        
        try {
            const aiRes = await GenerateTopicsAiModel.sendMessage(PROMPT);
            const topicIdea = JSON.parse(aiRes.response.text());
            const shortTopics = (topicIdea.course_titles || []).map(topic => topic.substring(0, 18));
            setTopics(shortTopics);
        } catch (error) {
            console.error('Error generating topics:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create New Course</Text>
            <Text style={styles.subHeader}>What do you want to learn today?</Text>
            <Text style={styles.description}>Write what course you want to create (e.g., Learn React JS, Digital Marketing Guide, 10th Science Chapter)</Text>
            <TextInput 
                style={styles.input}
                placeholder='(e.g., Learn Python, Learn Java, Learn Big Data)'
                onChangeText={setUserInput}
                value={userInput}
            />
            <TouchableOpacity style={styles.generateButton} onPress={onGenerateTopic} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <>
                        <FontAwesome name="magic" size={20} color="white" />
                        <Text style={styles.buttonText}>Generate Topic</Text>
                    </>
                )}
                <Text>Select All Topics which You need to add in the course</Text>
            </TouchableOpacity>
            {topics.length > 0 && (
                <View style={styles.topicContainer}>
                    {topics.map((item, index) => (
                        <View key={index} style={styles.topicItem}>
                            <Text style={styles.topicText}>{item}</Text>
                        </View>
                    ))}
                </View>
            )}
            <Text>Generate Course</Text>
        </View>
    );
};

export default AddCourse;

const styles = StyleSheet.create({
    container: {
        paddingTop:60,
        flex: 1,
        padding: 20,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 10,
        width: '80%',
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    topicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    topicItem: {
        backgroundColor: '#1E90FF',
        padding: 10,
        borderRadius: 5,
        margin: 5,
        width: '30%',
        alignItems: 'center',
    },
    topicText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
