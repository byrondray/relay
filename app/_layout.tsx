import React, { useEffect, useState } from "react";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from "react-native";
import { ApolloProvider, useSubscription } from "@apollo/client";
import client from "../graphql/client";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFirebaseAuth } from "@/firebaseConfig";
import { auth } from "@/firebaseConfig";
import { myTheme } from "./theme";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { FOREGROUND_NOTIFICATION_SUBSCRIPTION } from "@/graphql/map/queries";
import customMapping from "@/components/customStyling/custom-mapping.json";
import { TextSizeProvider } from "@/contexts/TextSizeContext";

const { width } = Dimensions.get("window");
import { ThemeProvider } from "@/contexts/ThemeContext";
import { playNotificationSound } from "@/utils/playSound";

import { useTheme } from "@/contexts/ThemeContext";
import Relay from "@/assets/images/Relay.svg";
import RelayWhite from "@/assets/images/Relay-white.svg";
import RelaySvg from "@/components/icons/RelaySvg";
import { Ionicons } from "@expo/vector-icons";


export default function RootLayout() {
  function Header() {
    const { currentColors } = useTheme();
    const isDarkMode = currentColors.background === "#181818";
    return (
      <View style={[styles.headerContainer, Platform.OS === "ios" ? { height: 86 } : { height: 60 }, isDarkMode ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }, { borderBottomWidth: 1, borderColor: "rgba(247, 176, 96, 0.4)" }]}>
        <StatusBar barStyle={ isDarkMode ? "light-content" : "dark-content" }/>
        <View style={{width: "100%", height: "100%", flexDirection: "row", backgroundColor: currentColors.headBackground }}>
          <View style={[Platform.OS === "ios" ? { marginTop: 45 } : { marginTop: 15 }, { flex: 1, flexDirection: "row", justifyContent: "center"}]}>
            <RelaySvg width={30} height={30} />
            {isDarkMode ? (
              <RelayWhite style={{ marginLeft: 10, marginTop: 5 }} />
            ) : (
              <Relay style={{ marginLeft: 10, marginTop: 5 }} />
            )}
          </View>
        </View>
      </View>
    );
  }

  const [fontsLoaded] = useFonts({
    Comfortaa: require("@/assets/fonts/Comfortaa-VariableFont_wght.ttf"),
    ComfortaaLight: require("@/assets/fonts/Comfortaa-Light.ttf"),
    ComfortaaRegular: require("@/assets/fonts/Comfortaa-Regular.ttf"),
    ComfortaaMedium: require("@/assets/fonts/Comfortaa-Medium.ttf"),
    ComfortaaSemiBold: require("@/assets/fonts/Comfortaa-SemiBold.ttf"),
    ComfortaaBold: require("@/assets/fonts/Comfortaa-Bold.ttf"),
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
      onComplete: (): void => console.log("notification", notificationData),
      client: client,
    }
  );

  useEffect(() => {
    if (notificationData?.foregroundNotification) {
      const { message } = notificationData.foregroundNotification;
      showAnimatedNotification(message);
      playNotificationSound();
    }
  }, [notificationData]);

  const showAnimatedNotification = (message: string) => {
    setNotification(message);
    setShowNotification(true);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowNotification(false);
        });
      }, 10000);
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
      {/* <SafeAreaView style={{ flex: 1 }}> */}
        <ApolloProvider client={client}>
          <ApplicationProvider
            {...eva}
            theme={
              colorScheme === "dark"
                ? { ...eva.dark, ...myTheme }
                : { ...eva.light, ...myTheme }
            }
            customMapping={customMapping as any}
          >
            <ThemeProvider>
              <TextSizeProvider>
                <View
                  style={
                    colorScheme === "dark"
                      ? styles.darkContainer
                      : styles.lightContainer
                  }
                >
                  <StatusBar barStyle={
                    colorScheme === "dark"
                      ? "light-content"
                      : "dark-content"
                  }/>
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
                        options={{ headerShown: true, header: () => <Header /> }}
                      />
                      <Stack.Screen
                        name="OnboardForms/child"
                        options={{ headerShown: true, header: () => <Header />}}
                      />
                      <Stack.Screen
                        name="OnboardForms/vehicle"
                        options={{ headerShown: true, header: () => <Header />}}
                      />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                  </NavigationThemeProvider>
                  {showNotification && (
                    <Animated.View
                      style={[
                        styles.notificationContainer,
                        { transform: [{ translateY: slideAnim }] },
                      ]}
                    >
                      <Text style={styles.notificationText}>
                        {notification}
                      </Text>
                    </Animated.View>
                  )}
                </View>
              </TextSizeProvider>
            </ThemeProvider>
          </ApplicationProvider>
        </ApolloProvider>
      {/* </SafeAreaView> */}
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
    width: width - 20,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: "#444",
    borderRadius: 15,
    zIndex: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    marginTop: 80,
  },
  notificationText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Comfortaa",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0,
  },
});
