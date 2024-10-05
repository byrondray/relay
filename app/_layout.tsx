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
import { StyleSheet, useColorScheme, View } from 'react-native';

export default function RootLayout() {
  const colorScheme = 'dark';

  return (
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
              <Stack.Screen name='+not-found' />
            </Stack>
          </View>
        </ThemeProvider>
      </ApplicationProvider>
    </ApolloProvider>
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
});
