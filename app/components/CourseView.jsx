import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CourseView = () => {
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const courseRef = doc(db, "Courses", courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        } else {
          console.log("No such course!");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Course not found</Text>
      </View>
    );
  }

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

  return (
    <ScrollView style={styles.container}>
      <Image
        source={imageAssets[course.banner_image] || require("../../assets/images/banner1.jpg")}
        style={styles.bannerImage}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent"]}
        style={styles.gradientOverlay}
      />
      <View style={styles.content}>
        <Text style={styles.courseName}>{course.course_name}</Text>
        <View style={styles.chapterCountContainer}>
          <FontAwesome5 name="book" size={16} color="#fff" />
          <Text style={styles.chapterCountText}>{course.chapters.length} Chapters</Text>
        </View>
        <Text style={styles.description}>{course.description}</Text>
        <TouchableOpacity style={styles.startButton}>
          <LinearGradient
            colors={["#1A237E", "#3949AB"]}
            style={styles.gradientButton}
          >
            <Text style={styles.startButtonText}>Start Now</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.chaptersTitle}>Chapters</Text>
        {course.chapters.map((chapter, index) => (
          <TouchableOpacity key={index} style={styles.chapterContainer}>
            <View style={styles.chapterIconContainer}>
              <FontAwesome5 name="file-alt" size={16} color="#1A237E" />
            </View>
            <Text style={styles.chapterName}>{chapter.chapter_name}</Text>
            <MaterialIcons name="play-circle-outline" size={24} color="#1A237E" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  courseName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A237E",
  },
  chapterCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  chapterCountText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
  },
  startButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  chaptersTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A237E",
  },
  chapterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chapterIconContainer: {
    backgroundColor: "#e8eaf6",
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  chapterName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CourseView;