import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { auth } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/queries';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';

const EXPO_PUBLIC_GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export const useAuthHooks = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  const [createUser] = useMutation(CREATE_USER);

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri: makeRedirectUri({
        scheme: 'myapp',
        native: 'myapp://redirect',
      }),
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notifications!');
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: '2999c675-2322-4719-814c-9b1f58cb15af',
        })
      ).data;
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('firebaseToken');
        if (token) {
          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              setUser(firebaseUser);
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
      setLoading(true);

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const firebaseUser = result.user;
          const firebaseId = firebaseUser.uid;
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem('firebaseToken', token);

          const expoPushToken = await registerForPushNotificationsAsync();

          const { data } = await createUser({
            variables: {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email,
              firebaseId,
              expoPushToken: expoPushToken || '',
            },
          });

          setUser(firebaseUser);
          setLoading(false);
          router.replace('/(tabs)/');
        })
        .catch((err) => {
          setLoading(false);
          setError('Google sign-up failed. Please try again.');
          console.error('Google sign-up error:', err);
        });
    }
  }, [response]);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = result.user;
      const firebaseId = firebaseUser.uid;

      const expoPushToken = await registerForPushNotificationsAsync();

      const { data } = await createUser({
        variables: {
          name,
          email,
          firebaseId,
          expoPushToken: expoPushToken || '',
        },
      });

      if (data?.createUser) {
        await AsyncStorage.setItem(
          'firebaseToken',
          await firebaseUser.getIdToken()
        );
        setUser(firebaseUser);
        setLoading(false);
        router.replace('/(tabs)/');
      }
    } catch (err: any) {
      setLoading(false);
      if (err.code && err.message) {
        setError(`Firebase error: ${err.message}`);
      } else {
        setError('Sign-up failed. Please try again.');
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    error,
    loading,
    handleSignUp,
    promptAsync,
    user,
  };
};
