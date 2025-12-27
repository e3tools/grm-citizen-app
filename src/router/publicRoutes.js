import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import AuthStack from '../screens/Auth'
import Login from '../screens/Auth/Login'
const Stack = createStackNavigator()
const PublicRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginStack"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AuthStack"
        component={AuthStack}
      />
    </Stack.Navigator>
  )
}

export default PublicRoutes
