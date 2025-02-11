import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserDetailContext } from "../context/UserDetailContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const CourseList = () => {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userDetail) {
      fetchCourses();
    }
  }, [userDetail]);
const onPress=(course)=>{
  if(Option.name=='Quiz'){
    router.push({
      pathname:'/quiz',
      params:{
        courseParams:course
      }
    })
  }
}
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "Courses"), where("createdBy", "==", userDetail?.email));
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          banner_image: data.banner_image || "default_image.jpg",
          course_name: data.course_name || "Unnamed Course",
          chapter_count: data.chapters ? data.chapters.length : 0,
        };
      });
      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Your Courses</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
      ) : courseList.length > 0 ? (
        <FlatList
          data={courseList}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: '/components/CourseView',
                params: { courseId: item.id }
              })}
            >
              <Image
                source={imageAssets[item.banner_image] || require("../../assets/images/banner1.jpg")}
                style={styles.bannerImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.courseName}>{item.course_name}</Text>
                <View style={styles.chapterContainer}>
                  <FontAwesome5 name="book" size={14} color="#1A237E" style={styles.chapterIcon} />
                  <Text style={styles.chapterCount}>{item.chapter_count} Chapters</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noCourses}>No courses available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f5f5f5",
    width: '100%',
    marginBottom: 60,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    paddingLeft: 10,
    fontStyle: 'italic'
  },
  card: {
    height: 230,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 16,
    width: 300,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    padding: 20,
  },
  bannerImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  chapterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  chapterIcon: {
    marginRight: 6,
  },
  chapterCount: {
    fontSize: 14,
    color: "#666",
  },
  noCourses: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CourseList;