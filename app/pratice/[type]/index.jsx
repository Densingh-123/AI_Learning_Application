import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Using Expo Icons for back button
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  const router = useRouter(); // For navigation
  const { userDetail } = useContext(UserDetailContext);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  id: `${doc.id}-${chapter.chapter_name}`, // Unique ID for each chapter
                  chapter_name: chapter.chapter_name,
                });
              });
            }
          });
          setChapters(chaptersList);
        } catch (error) {
          console.error("Error fetching chapters:", error);
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

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity style={styles.chapterBox} onPress={() => router.push(`/chapter/${item.id}`)}>
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
          <FlatList
            data={chapters}
            renderItem={renderChapterItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.chapterList}
            scrollEnabled={false} // Disable scrolling inside FlatList to allow ScrollView to handle it
          />
        ) : (
          <Text style={styles.errorText}>No chapters found for this course.</Text>
        )}
      </ScrollView>
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
});
