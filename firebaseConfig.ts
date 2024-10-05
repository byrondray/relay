import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const persistAuthState = async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      await AsyncStorage.setItem('firebaseToken', token);
    } else {
      await AsyncStorage.removeItem('firebaseToken');
    }
  });
};

const restoreAuthState = async () => {
  const token = await AsyncStorage.getItem('firebaseToken');
  if (token) {
    const credential = GoogleAuthProvider.credential(token);
    await signInWithCredential(auth, credential);
  }
};

export { auth, googleProvider, persistAuthState, restoreAuthState };
