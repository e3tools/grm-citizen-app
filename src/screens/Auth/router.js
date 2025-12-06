import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { i18n } from "../../translations/i18n";
import SignUp from "./SignUp";
const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={i18n.t('create_account')}
        component={SignUp}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
