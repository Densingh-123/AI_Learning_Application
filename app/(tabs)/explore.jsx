import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import NoCourse from '../components/NoCourse';

const { width } = Dimensions.get('window');

const technicalTopics = [
  { id: 'docker', name: 'Docker', subtopics: ['Containers', 'Images', 'Networking'], image: require('./../../assets/images/banner1.jpg') },
  { id: 'digital-marketing', name: 'Digital Marketing', subtopics: ['SEO', 'SEM', 'Content Marketing'], image: require('./../../assets/images/banner2.jpg') },
  { id: 'networking', name: 'Networking', subtopics: ['TCP/IP', 'DNS', 'Firewalls'], image: require('./../../assets/images/banner3.jpg') },
  { id: 'architecture', name: 'Architecture Design', subtopics: ['Microservices', 'Monolith', 'Serverless'], image: require('./../../assets/images/banner4.jpg') },
  { id: 'communication', name: 'Communication', subtopics: ['Protocols', 'APIs', 'WebSockets'], image: require('./../../assets/images/banner5.jpg') },
  { id: 'app-development', name: 'App Development', subtopics: ['React Native', 'Flutter', 'Swift'], image: require('./../../assets/images/banner6.jpg') },
  { id: 'ai', name: 'Artificial Intelligence', subtopics: ['Machine Learning', 'Neural Networks', 'Deep Learning'], image: require('./../../assets/images/banner7.jpg') },
  { id: 'cloud', name: 'Cloud Computing', subtopics: ['AWS', 'Azure', 'Google Cloud'], image: require('./../../assets/images/banner8.jpg') },
  { id: 'cybersecurity', name: 'Cybersecurity', subtopics: ['Encryption', 'Threat Analysis', 'Penetration Testing'], image: require('./../../assets/images/banner9.jpg') },
  { id: 'blockchain', name: 'Blockchain', subtopics: ['Cryptocurrency', 'Smart Contracts', 'Decentralization'], image: require('./../../assets/images/banner10.jpg') },
];

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const renderCourseRow = (rowData, index) => {
  const scrollDirection = index % 2 === 0 ? 'left' : 'right';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      key={index}
      directionalLockEnabled
      contentContainerStyle={scrollDirection === 'right' ? { flexDirection: 'row-reverse' } : {}}
    >
      {rowData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.image} style={styles.bannerImage} />
          <Text style={styles.chapterName}>{item.name}</Text>
          <View style={styles.subtopicsContainer}>
            {item.subtopics.map((subtopic, i) => (
              <Text key={i} style={styles.subtopicText}>{subtopic}</Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const CoursesScreen = () => {
  const [showNoCourse, setShowNoCourse] = useState(false);
  const courseChunks = chunkArray(technicalTopics, 3);

  return (
    <View style={styles.container}>
      {showNoCourse ? (
        <NoCourse />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={() => setShowNoCourse(true)}>
            <Text style={styles.buttonText}>Explore Courses</Text>
          </TouchableOpacity>
          <FlatList
            data={courseChunks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => renderCourseRow(item, index)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E2E',
    paddingVertical: 100,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E2E',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  card: {
    width: 250,
    height: 230,
    marginRight: 16,
    backgroundColor: '#2E2E3E',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  bannerImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  chapterName: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtopicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 8,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  subtopicText: {
    fontSize: 12,
    color: '#1E1E2E',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 10,
    fontWeight: 'bold',
    marginRight: 6,
    marginBottom: 6,
    textAlign: 'center',
  },
});

export default CoursesScreen;
