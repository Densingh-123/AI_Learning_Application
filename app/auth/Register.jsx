import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import { UserDetailContext } from "../context/UserDetailContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveUser } = useContext(UserDetailContext);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Toast.show({
        type: 'error',
        text1: 'All fields are required',
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        name,
        email: user.email,
        uid: user.uid,
        member: false,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      saveUser(userData);

      Toast.show({
        type: 'success',
        text1: 'Registration successful!',
      });

      router.replace("/components/Home");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://png.pngtree.com/background/20210714/original/pngtree-blue-geometric-small-fresh-education-learning-background-picture-image_1210546.jpg" }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.glassContainer}>
          <Text style={styles.title}>Register</Text>
          <TextInput style={styles.input} placeholder="Name" onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/Login")}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    marginTop: 10,
    textAlign: "center",
  },
});