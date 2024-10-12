import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Router } from 'expo-router';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const restoreAuthState = async () => {
  const token = await AsyncStorage.getItem('firebaseToken');
  if (token) {
    try {
      const credential = GoogleAuthProvider.credential(token);
      await signInWithCredential(auth, credential);
      console.log('User signed in with stored token.');
    } catch (error) {
      console.error('Failed to restore user authentication:', error);
      await AsyncStorage.removeItem('firebaseToken');
    }
  } else {
    console.log('No stored token found.');
  }
};

const persistAuthState = async (router: Router) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      await AsyncStorage.setItem('firebaseToken', token);
      console.log('User authenticated, token stored.');

      router.replace('/(tabs)');
    } else {
      await AsyncStorage.removeItem('firebaseToken');
      console.log('User signed out, token removed.');

      router.replace('/Login/login');
    }
  });
};

export const useFirebaseAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await restoreAuthState();
      persistAuthState(router);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return isLoading;
};

export { auth, googleProvider };
