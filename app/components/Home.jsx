import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { UserDetailContext } from "../context/UserDetailContext";
import { MaterialIcons } from "@expo/vector-icons";
import NoCourse from "./NoCourse";
import CourseList from "./CourseList";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../config/firebase";
import PraticeSession from './PraticeSession'
export default function Home() {
  const { userDetail, logoutUser } = useContext(UserDetailContext);
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userDetail) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    setCourseList([]);
    try {
      setLoading(true);
      const q = query(collection(db, "Courses"), where("createdBy", "==", userDetail?.email));
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/auth/Login");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>{getInitial(userDetail?.name)}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Hello, {userDetail?.name}!</Text>
          <Text style={styles.subtitle}>Let’s Get Started</Text>
        </View>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <MaterialIcons name="settings" size={28} color="white" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Effect */}
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={{ marginTop: 20 }} />
      ) : courseList.length == 0 ? (
        <NoCourse />
      
      ) : (
       <View>
        <PraticeSession/>
         <CourseList courseList={courseList} />

       </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 150,
    backgroundColor: "#1A237E",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  profileCircle: {
    marginLeft: 20,
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: "#ffffff33",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  profileText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  textContainer: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginLeft: -40,
  },
  dropdownMenu: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: 120,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});