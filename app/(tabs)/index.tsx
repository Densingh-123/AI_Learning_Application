import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/learns.webp')} 
        style={[styles.image, { height: height * 0.35 }]} // Dynamic image height
      />
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome to Coaching</Text>
        <Text style={styles.subText}>
          Transform your ideas into engaging educational content effortlessly with AI
        </Text>

        {/* ✅ "Get Started" navigates to Register */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/Register')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        {/* ✅ "Already Have An Account" navigates to Login */}
        <BlurView intensity={50} tint="light" style={styles.button1Container}>
          <TouchableOpacity style={styles.button1} onPress={() => router.push('/auth/Login')}>
            <Text style={styles.button1Text}>Already Have An Account</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    marginTop: 50,
    width: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: width * 0.07,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#0047AB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  welcomeText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: width * 0.045,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: width * 0.055,
  },
  button: {
    backgroundColor: 'white',
    width: '90%',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#0047AB',
    fontWeight: 'bold',
  },
  button1Container: {
    width: '90%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  button1: {
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button1Text: {
    fontSize: width * 0.045,
    color: 'white',
    fontWeight: 'bold',
  },
});