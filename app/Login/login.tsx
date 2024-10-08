import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN } from '@/graphql/queries';
import { useMutation } from '@apollo/client';
import { useAuthRequest } from 'expo-auth-session';

const EXPO_PUBLIC_GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [login] = useMutation(LOGIN);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri: 'https://auth.expo.io/@byrondray/relay',
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('firebaseToken');
        if (token) {
          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              router.replace('/(tabs)/');
            } else {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithPopup(auth, credential)
        .then(async (result) => {
          const firebaseUser = result.user;
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem('firebaseToken', token);
          setLoading(false);
          setUser(firebaseUser);
          router.replace('/(tabs)/');
        })
        .catch((err) => {
          setLoading(false);
          setError('Google sign-in failed.');
          console.error('Error signing in with Google:', err);
        });
    }
  }, [response]);

  const handleEmailPasswordSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();
      await AsyncStorage.setItem('firebaseToken', token);
      await login({ variables: { email, firebaseId: firebaseUser.uid } });
      setLoading(false);
      router.replace('/(tabs)/');
    } catch (err) {
      setLoading(false);
      setError('Email/Password sign-in failed. Please try again.');
      console.error('Error during email/password sign-in:', err);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <View>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? 'lightgray' : 'gray',
            }}
            placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
          />
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? 'lightgray' : 'gray',
            }}
            placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
          />
          <Button
            title='Sign in with Email'
            onPress={handleEmailPasswordSignIn}
          />

          <Link
            href='/Register/register'
            style={[
              styles.link,
              isDarkMode ? styles.linkDark : styles.linkLight,
            ]}
          >
            Don't have an account? Register
          </Link>
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  linkLight: {
    color: 'blue',
  },
  linkDark: {
    color: 'lightblue',
  },
});
