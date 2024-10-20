import React, { useEffect, useState } from "react";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import client from "../graphql/client";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import this
import { useFirebaseAuth } from "@/firebaseConfig";
import { GET_USER, UPDATE_EXPO_PUSH_TOKEN } from "@/graphql/queries";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isLoading = useFirebaseAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const user = auth.currentUser;
  const userId = user?.uid;

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
        console.error("Error getting Expo Push Token:", error);
        Alert.alert("Error", "Failed to get push notification token");
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

  if (isLoading || userLoading || updateTokenLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Wrap everything here */}
      <SafeAreaView style={{ flex: 1 }}>
        <ApolloProvider client={client}>
          <ApplicationProvider
            {...eva}
            theme={colorScheme === "dark" ? eva.dark : eva.light}
          >
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <View
                style={
                  colorScheme === "dark"
                    ? styles.darkContainer
                    : styles.lightContainer
                }
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
                  <Stack.Screen name="FirstPage" />
                  <Stack.Screen name="SecondPage" />
                  <Stack.Screen name="+not-found" />
                </Stack>
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
