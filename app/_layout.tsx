import { ApolloProvider } from '@apollo/client';
import client from '../graphql/client';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseAuth } from '@/firebaseConfig';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isLoading = useFirebaseAuth();

  useEffect(() => {
    console.log('useEffect triggered');

    const requestUserPermission = async () => {
      console.log('Requesting user permission for notifications...');

      try {
        const { status } = await Notifications.getPermissionsAsync();
        console.log('Current notification permission status:', status);

        if (status !== 'granted') {
          console.log('Permission not granted, requesting permission...');
          const { status: finalStatus } =
            await Notifications.requestPermissionsAsync();
          console.log('Final notification permission status:', finalStatus);

          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
        }

        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: '2999c675-2322-4719-814c-9b1f58cb15af',
          })
        ).data;
        console.log('Expo Push Token:', token);
      } catch (error) {
        console.error('Error getting Expo Push Token:', error);
      }
    };

    requestUserPermission();

    const handleForegroundNotification =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Received foreground notification:', notification);
      });

    const handleBackgroundNotification =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          'Notification caused app to open from background:',
          response.notification.request.content
        );
      });

    return () => {
      console.log('Removing notification subscriptions...');
      Notifications.removeNotificationSubscription(
        handleForegroundNotification
      );
      Notifications.removeNotificationSubscription(
        handleBackgroundNotification
      );
    };
  }, []);
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <ApplicationProvider
          {...eva}
          theme={colorScheme === 'dark' ? eva.dark : eva.light}
        >
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <View
              style={
                colorScheme === 'dark'
                  ? styles.darkContainer
                  : styles.lightContainer
              }
            >
              <Stack>
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='Login/login' />
                <Stack.Screen name='Register/register' />
                <Stack.Screen name='FirstPage' />
                <Stack.Screen name='SecondPage' />
                <Stack.Screen name='+not-found' />
              </Stack>
            </View>
          </ThemeProvider>
        </ApplicationProvider>
      </ApolloProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  lightContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
