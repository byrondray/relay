import React, { useEffect, useState } from "react";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { ApolloProvider, useSubscription } from "@apollo/client";
import client from "../graphql/client";
import { router, SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFirebaseAuth } from "@/firebaseConfig";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { myTheme } from "./theme";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { FOREGROUND_NOTIFICATION_SUBSCRIPTION } from "@/graphql/map/queries";

const { width } = Dimensions.get("window");
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Comfortaa: require("@/assets/fonts/Comfortaa-VariableFont_wght.ttf"),
    // ComfortaaLight: require("../../assets/fonts/Comfortaa-Light.ttf"),
    // ComfortaaRegular: require("../../assets/fonts/Comfortaa-Regular.ttf"),
    // ComfortaaMedium: require("../../assets/fonts/Comfortaa-Medium.ttf"),
    // ComfortaaSemiBold: require("../../assets/fonts/Comfortaa-SemiBold.ttf"),
    // ComfortaaBold: require("../../assets/fonts/Comfortaa-Bold.ttf"),
  });
  const colorScheme = useColorScheme();
  const isLoading = useFirebaseAuth();
  const [notification, setNotification] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const slideAnim = useState(new Animated.Value(-100))[0];
  const user = auth.currentUser;
  const userId = user?.uid;

  LogBox.ignoreAllLogs();

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const { data: notificationData } = useSubscription(
    FOREGROUND_NOTIFICATION_SUBSCRIPTION,
    {
      variables: { recipientId: userId },
      skip: !userId,
      onError: (err) => console.error("Subscription Error:", err.message),
      client: client,
    }
  );

  useEffect(() => {
    if (notificationData?.foregroundNotification) {
      const { message } = notificationData.foregroundNotification;
      showAnimatedNotification(message);
    }
  }, [notificationData]);

  const showAnimatedNotification = (message: string) => {
    setNotification(message);
    setShowNotification(true);

    Animated.timing(slideAnim, {
      toValue: 0, // Slide in
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100, // Slide out
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowNotification(false);
        });
      }, 5000); // Show for 5 seconds
    });
  };

  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ApolloProvider client={client}>
          <ApplicationProvider
            {...eva}
            theme={
              colorScheme === "dark"
                ? { ...eva.dark, ...myTheme }
                : { ...eva.light, ...myTheme }
            }
          >
            <ThemeProvider>
              <View
                style={
                  colorScheme === "dark"
                    ? styles.darkContainer
                    : styles.lightContainer
                }
              >
                <NavigationThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Login/login"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Register/register"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="OnboardForms/parent"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="OnboardForms/child"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="OnboardForms/vehicle"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </NavigationThemeProvider>
              </View>
            </ThemeProvider>
          </ApplicationProvider>
        </ApolloProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  lightContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    position: "absolute",
    top: 0,
    width: width - 40,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  notificationText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Comfortaa",
  },
});
