import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter, type Router } from "expo-router";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const googleProvider = new GoogleAuthProvider();

const restoreAuthState = async () => {
  const token = await AsyncStorage.getItem("firebaseToken");
  const user = auth.currentUser;

  if (user) {
    console.log("User is already authenticated");
    return;
  }

  if (token) {
    try {
      const credential = GoogleAuthProvider.credential(token);
      await signInWithCredential(auth, credential);
    } catch (error) {
      await AsyncStorage.removeItem("firebaseToken");
      console.error("Error signing in with token:", error);
    }
  }
};

const persistAuthState = async (router: Router) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      await AsyncStorage.setItem("firebaseToken", token);
      router.replace("/(tabs)");
    } else {
      await AsyncStorage.removeItem("firebaseToken");
      router.replace("/Login/login");
    }
  });
};

export const useFirebaseAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuthState = async () => {
      await restoreAuthState();
      persistAuthState(router);
      setIsLoading(false);
    };

    initializeAuthState();
  }, []);

  return isLoading;
};

export { auth, googleProvider };
