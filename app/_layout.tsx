import React, { useEffect, useState } from "react";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import client from "../graphql/client";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { router, SplashScreen, Stack } from "expo-router";
import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFirebaseAuth } from "@/firebaseConfig";
import { GET_USER, UPDATE_EXPO_PUSH_TOKEN } from "@/graphql/queries";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { myTheme } from "./theme";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"; // Import the ThemeProvider

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Comfortaa: require("@/assets/fonts/Comfortaa-VariableFont_wght.ttf"),
  });
  const colorScheme = useColorScheme();
  const isLoading = useFirebaseAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
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

  const [updateExpoPushToken, { loading: updateTokenLoading }] = useMutation(
    UPDATE_EXPO_PUSH_TOKEN,
    { client }
  );

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER, {
    variables: { id: userId },
    client,
    skip: !userId,
  });

  useEffect(() => {
    if (!userLoading && !userData?.getUser) {
      auth.signOut().then(() => {
        AsyncStorage.removeItem("firebaseToken");
        router.replace("/Login/login");
      });
    }
  }, [userLoading, userData]);

  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const { status: finalStatus } =
            await Notifications.requestPermissionsAsync();
          if (finalStatus !== "granted") {
            return;
          }
        }

        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "2999c675-2322-4719-814c-9b1f58cb15af",
          })
        ).data;

        setExpoPushToken(token);

        if (userId && token) {
          await updateExpoPushToken({
            variables: { userId, expoPushToken: token },
          });
        }
      } catch (error) {
        console.log("Error getting Expo Push Token:", error);
      }
    };

    requestUserPermission();

    const handleForegroundNotification =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Received foreground notification:", notification);
      });

    const handleBackgroundNotification =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification caused app to open from background:",
          response.notification.request.content
        );
      });

    return () => {
      Notifications.removeNotificationSubscription(
        handleForegroundNotification
      );
      Notifications.removeNotificationSubscription(
        handleBackgroundNotification
      );
    };
  }, [userId]);

  if (isLoading || userLoading || updateTokenLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
});
