import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, TextInput, Alert, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './../../config/firebase';
import { UserDetailContext } from './../../context/UserDetailContext';

export const praticeOption = [
  {
    name: "Quiz",
    image: require("../../../assets/images/quiz.jpg"),
    icon: { uri: "https://cdn-icons-png.flaticon.com/128/7128/7128250.png" },
  },
  {
    name: "FlashCards",
    image: require("../../../assets/images/card.png"),
    icon: { uri: "https://cdn-icons-png.flaticon.com/128/867/867454.png" },
  },
  {
    name: "Questions",
    image: require("../../../assets/images/qa.webp"),
    icon: { uri: "https://cdn-icons-png.flaticon.com/128/7770/7770324.png" },
  },
];

const PracticeType = () => {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultImage, setResultImage] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      if (userDetail?.email) {
        try {
          const q = query(collection(db, 'Courses'), where('createdBy', '==', userDetail.email));
          const querySnapshot = await getDocs(q);
          const chaptersList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.chapters) {
              data.chapters.forEach((chapter) => {
                chaptersList.push({
                  id: `${doc.id}-${chapter.chapter_name}`,
                  chapter_name: chapter.chapter_name,
                  ...chapter,
                });
              });
            }
          });
          setChapters(chaptersList);
        } catch (error) {
          console.error("Error fetching chapters:", error);
          Alert.alert("Error", "Failed to fetch chapters. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChapters();
  }, [userDetail]);

  const selectedOption = praticeOption.find(
    (item) => item.name.toLowerCase() === type?.toLowerCase()
  );

  const handleChapterPress = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentIndex(0);
    setUserAnswer("");
    setScore(0);
    setShowScore(false);
  };

  const handleNext = () => {
    if (currentIndex < (selectedChapter[type.toLowerCase()]?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
    } else {
      setShowScore(true);
      const totalQuestions = selectedChapter[type.toLowerCase()]?.length || 0;
      const percentage = (score / totalQuestions) * 100;
      updateScoreInDB(percentage);
      showResultPopup(percentage);
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = selectedChapter[type.toLowerCase()][currentIndex]?.answer;
    if (userAnswer.trim().toLowerCase() === correctAnswer?.toLowerCase()) {
      setScore(score + 1);
    }
    handleNext();
  };

  const updateScoreInDB = async (percentage) => {
    try {
      const courseRef = doc(db, 'Courses', selectedChapter.id.split('-')[0]);
      await updateDoc(courseRef, {
        progress: arrayUnion(`${type}: ${score}/${selectedChapter[type.toLowerCase()]?.length || 0} (${percentage.toFixed(2)}%)`)
      });
    } catch (error) {
      console.error("Error updating score:", error);
      Alert.alert("Error", "Failed to update score. Please try again.");
    }
  };

  const showResultPopup = (percentage) => {
    if (percentage >= 30) {
      setResultMessage(`Congratulations! You have secured ${percentage.toFixed(2)}%`);
      setResultImage({ uri: "https://cdn-icons-png.flaticon.com/128/9512/9512451.png" });
    } else {
      setResultMessage(`Try Again! Work hard and need to improve. You have secured ${percentage.toFixed(2)}%`);
      setResultImage({ uri: "https://cdn-icons-png.flaticon.com/128/9512/9512451.png" });
    }
    setShowResultModal(true);
  };

  const renderContent = () => {
    if (!selectedChapter || !selectedChapter[type.toLowerCase()]) {
      return <Text style={styles.errorText}>No data found for this chapter.</Text>;
    }

    const content = selectedChapter[type.toLowerCase()][currentIndex];
    if (!content) {
      return <Text style={styles.errorText}>No content available.</Text>;
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>{content.question || content.text}</Text>
        {type.toLowerCase() === "quiz" ? (
          content.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => setUserAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))
        ) : type.toLowerCase() === "questions" ? (
          <View style={styles.qaContainer}>
            <Text style={styles.answerText}>{content.answer}</Text>
          </View>
        ) : (
          <TextInput
            style={styles.answerInput}
            placeholder="Your answer"
            value={userAnswer}
            onChangeText={setUserAnswer}
          />
        )}
        {type.toLowerCase() !== "questions" && (
          <TouchableOpacity style={styles.nextButton} onPress={handleAnswerSubmit}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity style={styles.chapterBox} onPress={() => handleChapterPress(item)}>
      {selectedOption ? (
        <Image source={selectedOption.icon} style={styles.iconImage} />
      ) : (
        <Text>Icon not found</Text>
      )}
      <Text style={styles.chapterName} numberOfLines={2} ellipsizeMode="tail">
        {item.chapter_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {selectedOption ? (
          <>
            <Image source={selectedOption.image} style={styles.image} />
            <Text style={styles.title}>{selectedOption.name}</Text>
            <Text style={styles.description}>
              Start practicing with {selectedOption.name} to improve your skills!
            </Text>
          </>
        ) : (
          <Text style={styles.errorText}>
            Practice type not found! Check the URL parameter.
          </Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2c3e50" />
        ) : chapters.length > 0 ? (
          <>
            {selectedChapter ? (
              <>
                {renderContent()}
                {showScore && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Your Score: {score}/{selectedChapter[type.toLowerCase()]?.length || 0}</Text>
                  </View>
                )}
              </>
            ) : (
              <FlatList
                data={chapters}
                renderItem={renderChapterItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.chapterList}
                scrollEnabled={false}
              />
            )}
          </>
        ) : (
          <Text style={styles.errorText}>No chapters found for this course.</Text>
        )}
      </ScrollView>

      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={resultImage} style={styles.resultImage} />
            <Text style={styles.resultText}>{resultMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowResultModal(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PracticeType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    margin: -15,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#2c3e50",
    padding: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  chapterList: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  chapterBox: {
    width: 160,
    height: 160,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  contentContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  answerInput: {
    padding: 15,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    marginBottom: 20,
  },
  nextButton: {
    padding: 15,
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  scoreContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  qaContainer: {
    padding: 15,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    marginBottom: 20,
  },
  answerText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  resultImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});