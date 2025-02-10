import {useContext} from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import {onAuthStateChanged} from 'firebase/auth'
import {auth, db} from '../config/firebase'
import { doc, getDoc } from "@firebase/firestore";
import { UserDetailContext } from "../context/UserDetailContext";
export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
onAuthStateChanged(auth,async(user)=>{
  if(user){
    console.log(user);
    const result = await getDoc(doc(db,'users',user?.email));
    setUserDetail(result.data());
    router.replace('/component/Home')
  }
})
  return (
    <View style={styles.container}>
      {/* Responsive Image */}
      <Image 
        source={require("../../assets/images/learns.webp")} 
        style={[styles.image, { height: height * 0.4, width: width * 0.9 }]} 
      />
      
      <View style={[styles.contentContainer, { width: width > 768 ? "60%" : "90%" }]}>
        <Text style={styles.welcomeText}>Welcome to Coaching</Text>
        <Text style={styles.subText}>
          Transform your ideas into engaging educational content effortlessly with AI
        </Text>

        {/* ✅ "Get Started" navigates to Register */}
        <TouchableOpacity 
          style={[styles.button, { width: width > 768 ? "50%" : "90%" }]} 
          onPress={() => router.push("/auth/Register")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* ✅ "Already Have An Account" navigates to Login */}
        <BlurView intensity={50} tint="light" style={[styles.button1Container, { width: width > 768 ? "50%" : "90%" }]}>
          <TouchableOpacity style={styles.button1} onPress={() => router.push("/auth/Login")}>
            <Text style={styles.button1Text}>Already Have An Account</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "cover",
    borderRadius: 15,
    marginTop: Platform.OS === "web" ? 30 : 50,
  },
  contentContainer: {

    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#0047AB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#0047AB",
    fontWeight: "bold",
  },
  button1Container: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
  },
  button1: {
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  button1Text: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
