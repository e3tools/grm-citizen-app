import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import HomeRouter from "../screens/Home";

const Stack = createStackNavigator();

const PrivateRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Main"
        component={HomeRouter}
      />
    </Stack.Navigator>
  );
};

export default PrivateRoutes;
