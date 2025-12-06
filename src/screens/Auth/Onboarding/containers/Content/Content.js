import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { i18n } from "../../../../../translations/i18n";
import { styles } from "./Content.style";

const Content = () => {
  // const { colors } = useTheme();
  const customStyles = styles();
  const navigation = useNavigation();

  return (
    <View style={customStyles.content}>
        <Button
          style={customStyles.button}
          mode="contained"
          onPress={() => {
            navigation.navigate("AuthStack", { screen: "SignUp" });
          }}
        >
          {i18n.t('sign_up')}
        </Button>
    </View>
  );
};

export default Content;
