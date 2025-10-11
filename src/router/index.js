import {
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from "react";
import { AppState, View } from "react-native";
import { shallowEqual, useSelector } from "react-redux";
import PrivateRoutes from "./privateRoutes";
import PublicRoutes from "./publicRoutes";

SplashScreen.preventAutoHideAsync();

const Router = ({ theme }) => {
  const [loading, setLoading] = useState(true);
  // const rootNavigationState = useRootNavigationState(); // Removed

  const appState = useRef(AppState.currentState);

  const { session } = useSelector((state) => {
    return state.get("authentication").toObject();
  }, shallowEqual);


  useEffect(() => {
    // Remove explicit setLoading(false) here, as font loading will handle splash screen hiding.
    // setLoading(false);
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, resume syncs
        try {
          setLoading(false);
        } catch (err) {
          console.warn('Error resuming syncs:', err);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };

  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Set loading to false once fonts are loaded and splash screen is hidden
      setLoading(false);
    }
  }, [fontsLoaded]);

  if (loading || !fontsLoaded /* || !rootNavigationState?.isLoaded */) return <View />;

  return (
    // <React.Suspense fallback={<View />}> // Removed
      <NavigationContainer theme={theme || DefaultTheme}>
        { session ? <PrivateRoutes /> : <PublicRoutes /> }
      </NavigationContainer>
    // </React.Suspense> // Removed
  );
};

export default Router;
