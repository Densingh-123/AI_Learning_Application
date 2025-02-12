import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { UserDetailContext } from "../context/UserDetailContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NoCourse from "../components/NoCourse";

export default function ProfileScreen() {
  const { userDetail, logoutUser } = useContext(UserDetailContext);
  const router = useRouter();
  const [showNoCourse, setShowNoCourse] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/auth/Login");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <View style={styles.container}>
      {showNoCourse ? (
        <NoCourse />
      ) : (
        <>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>{getInitial(userDetail?.name)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{userDetail?.name || "User Name"}</Text>
              <Text style={styles.subtitle}>{userDetail?.email || "user@example.com"}</Text>
            </View>
          </View>

          {/* Main Content Section */}
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Explore More Courses</Text>
            <View style={styles.courseContainer}>
              <TouchableOpacity style={styles.courseCard}>
                <MaterialIcons name="code" size={32} color="#1A237E" />
                <Text style={styles.courseTitle}>App Development</Text>
                <Text style={styles.courseDescription}>Learn to build mobile apps with React Native.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.courseCard}>
                <MaterialIcons name="web" size={32} color="#1A237E" />
                <Text style={styles.courseTitle}>Web Development</Text>
                <Text style={styles.courseDescription}>Master React for building modern web applications.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.courseCard}>
                <MaterialIcons name="settings-ethernet" size={32} color="#1A237E" />
                <Text style={styles.courseTitle}>Networking</Text>
                <Text style={styles.courseDescription}>Understand the fundamentals of computer networking.</Text>
              </TouchableOpacity>
            </View>

            {/* Create New Course Button */}
            <TouchableOpacity style={styles.createCourseButton} onPress={() => setShowNoCourse(true)}>
              <Text style={styles.createCourseButtonText}>Create New Course</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Section */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="white" />
              <Text style={styles.footerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: "100%",
    height: 200,
    backgroundColor: "#1A237E",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff33",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  profileText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
    opacity: 0.8,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 20,
  },
  courseContainer: {
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A237E",
    marginTop: 10,
  },
  courseDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  createCourseButton: {
    backgroundColor: "#1A237E",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  createCourseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  footer: {
    width: 100,
    height: 140,
    paddingBottom: 100,
    position: "absolute",
    top: 60,
    right: 30,
    backgroundColor: "#1A237E",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
});
