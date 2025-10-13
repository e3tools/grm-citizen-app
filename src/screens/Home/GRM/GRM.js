import React from "react";
import { SafeAreaView, Text } from "react-native";
import { styles } from "./GRM.style";

const GRM = () => {
  const customStyles = styles();
  return (
    <SafeAreaView style={customStyles.container}>
      <Text> Home </Text>
    </SafeAreaView>
  );
};

export default GRM;
