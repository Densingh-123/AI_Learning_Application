import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserDetailContext } from "../context/UserDetailContext";
import { FontAwesome5 } from "@expo/vector-icons";

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

  useEffect(() => {
    if (userDetail) {
      fetchCourses();
    }
  }, [userDetail]);

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
    <View style={styles.container}>
      <Text style={styles.title}>Course Progress</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={courseList}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={imageAssets[item.banner_image] || imageAssets["/banner1.jpg"]}
                style={styles.bannerImage}
              />
              <View style={styles.cardContent}>
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
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginLeft: 10,
  },
  card: {
    width: 300,
    height: 280,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 15,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 15,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 5,
  },
  chapterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chapterCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  progressBar: {
    marginVertical: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#444",
  },
});

export default CourseProgress;