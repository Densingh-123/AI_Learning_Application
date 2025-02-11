import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const Quiz = () => {
  const { chapterId } = useLocalSearchParams();

  return (
    <View>
      <Text>Quiz for Chapter: {chapterId}</Text>
      {/* Add your quiz logic here */}
    </View>
  );
};

export default Quiz;