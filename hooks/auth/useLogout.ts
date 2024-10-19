import { useState } from "react";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();

      await AsyncStorage.removeItem("firebaseToken");

      router.replace("/Login/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
