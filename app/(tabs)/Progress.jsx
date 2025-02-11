import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Animated, Easing, ScrollView } from "react-native";
import * as Progress from "react-native-progress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserDetailContext } from "../context/UserDetailContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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

const CourseProgress = () => {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (userDetail) {
      fetchCourses();
    }
  }, [userDetail]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "Courses"), where("createdBy", "==", userDetail?.email));
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const completedChapters = data.completedChapters || [];
        const chapterCount = data.chapters ? data.chapters.length : 0;
        const progress = chapterCount > 0 ? completedChapters.length / chapterCount : 0;

        return {
          id: doc.id,
          banner_image: data.banner_image || "/banner1.jpg",
          course_name: data.course_name || "Unnamed Course",
          chapter_count: chapterCount,
          completed_chapters: completedChapters.length,
          progress: progress,
        };
      });
      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#B2EBF2"]} style={styles.container}>
      <Text style={styles.title}>Course Progress</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={courseList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <Image
                source={imageAssets[item.banner_image] || imageAssets["/banner1.jpg"]}
                style={styles.bannerImage}
              />
              <LinearGradient colors={["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)"]} style={styles.cardContent}>
                <Text style={styles.courseName}>{item.course_name}</Text>
                <View style={styles.chapterContainer}>
                  <FontAwesome5 name="book" size={14} color="#FFD700" />
                  <Text style={styles.chapterCount}>{item.chapter_count} Chapters</Text>
                </View>
                <Progress.Bar
                  progress={item.progress}
                  width={250}
                  height={10}
                  color="#4CAF50"
                  borderRadius={5}
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>
                  {item.completed_chapters} out of {item.chapter_count} chapters completed
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  flatListContent: {
    paddingBottom: 30, // Add bottom margin
    paddingTop: 10, // Add top margin
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 20,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 10,
  },
  chapterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chapterCount: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  progressBar: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
});

export default CourseProgress;