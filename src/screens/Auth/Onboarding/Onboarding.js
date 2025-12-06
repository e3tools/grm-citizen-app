import React from "react";
import { SafeAreaView } from "react-native";
import Content from "./containers/Content";
const Onboarding = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <Content />
    </SafeAreaView>
  );
};

export default Onboarding;
