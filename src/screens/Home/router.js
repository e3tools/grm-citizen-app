import React from "react";

import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import posed from 'react-native-pose';
import { version } from '../../../package.json';
import { i18n } from "../../translations/i18n";
import { colors } from '../../utils/colors';
import GRM from './GRM/GRM';



const iconConfig = {
  focused: {
    x: 0,
    transition: { type: 'tween', ease: 'linear' },
  },
  unfocused: { x: 0 },
};

const customHeaderOptions = (label) => ({
  headerBackTitle: () => null,
  headerTintColor: '#00bc82',
  headerTitle: () => { return (<View>
          <View>
            <Text>{label}</Text>
            <Text style={{ color: colors.secondary, fontSize: 12, textAlign: "center" }}>
               v {version}
            </Text>
      </View>
  </View>)},
  headerTitleAllowFontScaling: true,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#373737',
  },
});

const customHeaderRightIcon = ({ navigation }) => ({
  headerRight: () => (
      <View style={styles.iconContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate('SearchBarGrm')
          }}>
          <Icon type="ionicon" color={colors.primary} size={35}
                name={Platform.OS === "ios" ? "ios-search" : "search"}/>
        </Pressable>
      </View>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  icon: {
    paddingLeft: 10
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginRight: 25
  }
});

const Tab = createBottomTabNavigator();
const AnimatedFeatherIcon = posed(Feather)(iconConfig);
const HomeStack = createStackNavigator();

function DashboardStackScreen() {
  return (
    <HomeStack.Navigator>
      {/* GRM Module */}
      <HomeStack.Screen
        name="GRM"
        component={HomeRouter}
        options={({ navigation, route }) => ({
          ...customHeaderOptions(i18n.t('label_grm')),
          ...customHeaderRightIcon({navigation, route})
        })}
      />
    </HomeStack.Navigator>
  );
}



function HomeRouter() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedFeatherIcon
              pose={focused ? 'focused' : 'unfocused'}
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
        component={GRM}
      />
    </Tab.Navigator>
  );
}

export default DashboardStackScreen;
