import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOGIN } from "@/graphql/queries";
import { auth } from "@/firebaseConfig";
import { useMutation } from "@apollo/client";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { Alert } from "react-native";
import { LoginMutation, LoginMutationVariables } from "@/graphql/generated";
import { router } from "expo-router";
import * as AuthSession from "expo-auth-session";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// GoogleSignin.configure({
//   webClientId:
//     "738638020160-qur8etso7sbn7k2ofr3c3b3aemc5353o.apps.googleusercontent.com",
// });

// export async function onGoogleButtonPress() {
//   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//   const userInfo = await GoogleSignin.signIn();
//   const idToken = userInfo.data?.idToken;

//   const googleCredential = GoogleAuthProvider.credential(idToken);

//   return signInWithCredential(auth, googleCredential);
// }

export const useLoginHooks = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [login] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN);

  const [request, response, promptAsync] = useAuthRequest({
    iosClientId:
      "282407202899-qum38oc4b66oe3b2lg3jpvo3r1d8hidb.apps.googleusercontent.com",
    androidClientId:
      "282407202899-020fmrptdej6g3h8uk4t53p1ra7l6r3s.apps.googleusercontent.com",
    // redirectUri: "https://accounts.google.com/o/oauth2/auth",
  });

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notifications!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "2999c675-2322-4719-814c-9b1f58cb15af",
      })
    ).data;

    return token;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("firebaseToken");
        if (token) {
          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              router.replace("/(tabs)/");
            } else {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const firebaseUser = result.user;
          const token = await firebaseUser.getIdToken();
          const expoPushToken = await registerForPushNotificationsAsync();

          await AsyncStorage.setItem("firebaseToken", token);
          setUser(firebaseUser);
          setLoading(false);

          if (!firebaseUser.email) {
            setError("Google sign-in failed. No email found.");
            return;
          }

          await login({
            variables: {
              email: firebaseUser.email,
              firebaseId: firebaseUser.uid,
              expoPushToken: expoPushToken || "",
            },
          });

          router.replace("/(tabs)/");
        })
        .catch((err) => {
          setLoading(false);
          setError("Google sign-in failed.");
          console.error("Error signing in with Google:", err);
        });
    }
  }, [response]);

  const handleEmailPasswordSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();
      const expoPushToken = await registerForPushNotificationsAsync();

      await AsyncStorage.setItem("firebaseToken", token);
      await login({
        variables: {
          email,
          firebaseId: firebaseUser.uid,
          expoPushToken: expoPushToken || "",
        },
      });
      setLoading(false);
      router.replace("/(tabs)/");
    } catch (err) {
      setLoading(false);
      setError("Email/Password sign-in failed. Please try again.");
      console.error("Error during email/password sign-in:", err);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleEmailPasswordSignIn,
    promptAsync,
  };
};
