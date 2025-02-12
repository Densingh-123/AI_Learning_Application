import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NoCourse = () => {
  const router = useRouter(); // Hook must be inside the component

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/6476/6476032.png' }}
        style={styles.image}
      />
      <Text style={styles.message}>You don't have any courses</Text>
      
      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/components/AddCourse')}>
        <FontAwesome5 name="plus-circle" size={20} color="white" />
        <Text style={styles.buttonText}>Create a New Course</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.exploreButton} onPress={() => router.back()}>
        <MaterialIcons name="explore" size={22} color="white" />
        <Text style={styles.buttonText}>Explore Existing Courses</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoCourse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4682B4',
    padding: 12,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
