import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider } from "../firebase";
import { useRouter } from "expo-router";
import { showMessage } from "react-native-flash-message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showMessage({ message: "Login successful!", type: "success" });
      router.replace("/components/Home");
    } catch (error) {
      showMessage({ message: "Invalid credentials", type: "danger" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user data to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
      });

      showMessage({ message: "Google Login successful!", type: "success" });
      router.replace("/components/Home");
    } catch (error) {
      showMessage({ message: "Google Login failed", type: "danger" });
      console.error(error);
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://png.pngtree.com/background/20210714/original/pngtree-blue-geometric-small-fresh-education-learning-background-picture-image_1210546.jpg' }} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.glassContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/Register")}>
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
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
  },
  googleButton: {
    backgroundColor: "#db4437",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    marginTop: 10,
    textAlign: 'center',
  },
});