import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const ChapterView = () => {
  const { chapter } = useLocalSearchParams();
  const [chapterData, setChapterData] = useState(JSON.parse(chapter || '{}'));
  const [copied, setCopied] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(25); // Default progress for viewing the chapter
  const [flashcardProgress, setFlashcardProgress] = useState(false);
  const [questionProgress, setQuestionProgress] = useState(false);

  const imageAssets = {
    "/banner1.jpg": require("../../assets/images/banner1.jpg"),
    "/banner2.jpg": require("../../assets/images/banner2.jpg"),
    "/banner3.jpg": require("../../assets/images/banner3.jpg"),
    "/banner4.jpg": require("../../assets/images/banner4.jpg"),
    "/banner5.jpg": require("../../assets/images/banner5.jpg"),
    "/banner6.jpg": require("../../assets/images/banner6.jpg"),
    "/banner7.jpg": require("../../assets/images/banner7.jpg"),
    "/banner8.jpg": require("../../assets/images/banner8.jpg"),
    "/banner9.jpg": require("../../assets/images/banner9.jpg"),
    "/banner10.jpg": require("../../assets/images/banner10.jpg"),
  };

  const praticeOption = [
    {
      name: "Quiz",
      image: require("../../assets/images/quiz.jpg"),
      icon: "quiz",
    },
    {
      name: "FlashCards",
      image: require("../../assets/images/card.png"),
      icon: "flash-on",
    },
    {
      name: "Question",
      image: require("../../assets/images/qa.webp"),
      icon: "question-answer",
    },
  ];

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateProgressInDB = async (newProgress) => {
    const courseRef = doc(db, "Courses", chapterData.id);
    await updateDoc(courseRef, {
      progress: newProgress,
    });
  };

  const handleQuizCompletion = () => {
    const newProgress = 65; // 25% (default) + 40% (quiz completion)
    setProgress(newProgress);
    updateProgressInDB(newProgress);
  };

  const handleFlashcardCompletion = () => {
    if (!flashcardProgress) {
      const newProgress = progress + 25;
      setProgress(newProgress);
      setFlashcardProgress(true);
      updateProgressInDB(newProgress);
    }
  };

  const handleQuestionCompletion = () => {
    if (!questionProgress) {
      const newProgress = progress + 25;
      setProgress(newProgress);
      setQuestionProgress(true);
      updateProgressInDB(newProgress);
    }
  };

  useEffect(() => {
    // Automatically update progress for flashcards and questions after 30 seconds
    const timer = setTimeout(() => {
      handleFlashcardCompletion();
      handleQuestionCompletion();
    }, 30000); // 30 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleQuizOptionClick = (option, quiz) => {
    setSelectedOption(option);
    setShowAnswer(true);
    if (option === quiz.answer) {
      handleQuizCompletion();
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < (chapterData.quiz?.length || 0) - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const renderQuiz = () => {
    const quiz = chapterData.quiz?.[currentQuizIndex];
    if (!quiz) return null;

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.sectionTitle}>Quiz</Text>
        <Text style={styles.quizQuestion}>{quiz.question}</Text>
        {quiz.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.quizOption,
              showAnswer && option === quiz.answer && styles.correctOption,
              showAnswer && option !== quiz.answer && selectedOption === option && styles.wrongOption,
            ]}
            onPress={() => handleQuizOptionClick(option, quiz)}
            disabled={showAnswer}
          >
            <Text style={styles.quizOptionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {showAnswer && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextQuiz}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFlashcards = () => {
    if (!chapterData.flashcards) return null;

    return (
      <View style={styles.flashcardContainer}>
        <Text style={styles.sectionTitle}>Flashcards</Text>
        {chapterData.flashcards.map((flashcard, index) => (
          <Flashcard key={index} flashcard={flashcard} />
        ))}
      </View>
    );
  };

  const renderQuestions = () => {
    if (!chapterData.q_and_a) return null;

    return (
      <View style={styles.qaContainer}>
        <Text style={styles.sectionTitle}>Questions & Answers</Text>
        {chapterData.q_and_a.map((qa, index) => (
          <View key={index} style={styles.qaItem}>
            <Text style={styles.qaQuestion}>{qa.question}</Text>
            <Text style={styles.qaAnswer}>{qa.answer}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={imageAssets[chapterData.banner_image] || require("../../assets/images/banner1.jpg")}
        style={styles.bannerImage}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={styles.gradientOverlay}
      />
      <View style={styles.content}>
        <Text style={styles.chapterName}>{chapterData.chapter_name}</Text>
        <Text style={styles.description}>{chapterData.description}</Text>

        {chapterData.code_example && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Code Example:</Text>
            <TouchableOpacity
              style={styles.codeBlock}
              onPress={() => copyToClipboard(chapterData.code_example)}
            >
              <Text style={styles.codeText}>{chapterData.code_example}</Text>
              <MaterialIcons name="content-copy" size={20} color="#1A237E" />
            </TouchableOpacity>
            {copied && <Text style={styles.copiedText}>Copied!</Text>}
          </View>
        )}

        <Text style={styles.contentText}>{chapterData.content}</Text>

        <Text style={styles.sectionTitle}>Practice Options</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {praticeOption.map((option, index) => (
            <TouchableOpacity key={index} style={styles.practiceOption}>
              <Image source={option.image} style={styles.practiceImage} />
              <View style={styles.iconContainer}>
                <MaterialIcons name={option.icon} size={24} color="#1A237E" />
              </View>
              <Text style={styles.practiceText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderQuiz()}
        {renderFlashcards()}
        {renderQuestions()}
      </View>
    </ScrollView>
  );
};

const Flashcard = ({ flashcard }) => {
  const [flipped, setFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setFlipped(true));
  };

  const flipBack = () => {
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setFlipped(false));
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={styles.flashcardItem}>
      <Animated.View
        style={[styles.flashcard, { transform: [{ rotateY: frontInterpolate }] }]}
      >
        <Text style={styles.flashcardText}>{flashcard.answer}</Text>
        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          <Text style={styles.flipButtonText}>Flip</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[styles.flashcard, styles.flashcardBack, { transform: [{ rotateY: backInterpolate }] }]}
      >
        <Text style={styles.flashcardText}>{flashcard.text}</Text>
        <TouchableOpacity style={styles.flipButton} onPress={flipBack}>
          <Text style={styles.flipButtonText}>Flip Back</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  bannerImage: {
    width: "100%",
    height: 300,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  content: {
    padding: 20,
    marginTop: -50,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  chapterName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A237E",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A237E",
  },
  codeBlock: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "monospace",
  },
  copiedText: {
    fontSize: 14,
    color: "#1A237E",
    marginTop: 5,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A237E",
    paddingLeft: 5,
  },
  practiceOption: {
    marginRight: 15,
    alignItems: "center",
    position: "relative",
  },
  practiceImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 5,
  },
  practiceText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontWeight: "bold",
  },
  quizContainer: {
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A237E",
  },
  quizOption: {
    backgroundColor: "#f0f4ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  quizOptionText: {
    fontSize: 16,
    color: "#333",
  },
  correctOption: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  wrongOption: {
    borderColor: "#F44336",
    borderWidth: 2,
  },
  nextButton: {
    backgroundColor: "#1A237E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flashcardContainer: {
    marginBottom: 20,
  },
  flashcardItem: {
    marginBottom: 20,
  },
  flashcard: {
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  flashcardBack: {
    position: "absolute",
    top: 0,
  },
  flashcardText: {
    fontSize: 16,
    color: "#333",
  },
  flipButton: {
    marginTop: 10,
    backgroundColor: "#1A237E",
    padding: 10,
    borderRadius: 10,
  },
  flipButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  qaContainer: {
    marginBottom: 20,
  },
  qaItem: {
    marginBottom: 20,
  },
  qaQuestion: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A237E",
  },
  qaAnswer: {
    fontSize: 16,
    color: "#333",
  },
});

export default ChapterView;