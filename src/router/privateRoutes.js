import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import CompleteProfile from '../screens/Auth/CompleteProfile'
import HomeRouter from '../screens/Home'
import {i18n} from '../translations/i18n'
import {Text} from 'react-native'
import styles from '../screens/Auth/CompleteProfile/CompleteProfile.style'

const Stack = createStackNavigator()

const PrivateRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={({navigation}) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerRightContainerStyle: {paddingRight: 20},
          headerRight: () => (
            <Text
              style={styles.loginLink}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Main'}],
                })
              }
            >
              {i18n.t('skip')}
            </Text>
          ),
        })}
        name={i18n.t('complete_profile')}
        component={CompleteProfile}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Main"
        component={HomeRouter}
      />
    </Stack.Navigator>
  )
}

export default PrivateRoutes
