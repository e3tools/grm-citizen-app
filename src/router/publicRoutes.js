import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "../screens";
import Onboarding from "../screens/Auth/Onboarding";
const Stack = createStackNavigator();
const PublicRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OnboardingStack"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AuthStack"
        component={AuthStack}
      />
    </Stack.Navigator>
  );
};

export default PublicRoutes;
