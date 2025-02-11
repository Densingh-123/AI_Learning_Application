import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export const practiceOption = [
  {
    name: "Quiz",
    image: require("../../assets/images/quiz.jpg"),
  },
  {
    name: "FlashCards",
    image: require("../../assets/images/card.png"),
  },
  // {
  //   name: "Questions",
  //   image: require("../../assets/images/qa.webp"),
  // },
];

const PracticeSession = () => {
  const router = useRouter();

  const handleNavigation = (name) => {
    router.push(`/pratice/${name.toLowerCase()}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <FlatList
        data={practiceOption}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigation(item.name)}
          >
            <Image source={item.image} style={styles.image} />
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "transparent"]}
              style={styles.overlay}
            />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default PracticeSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    width: "100%",
    marginBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
    marginBottom: 20,
    color: "#333",
    fontStyle: "italic",
  },
  card: {
    height: 150,
    width: 160,
    paddingBottom:10,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  cardText: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 10,
  },
});
