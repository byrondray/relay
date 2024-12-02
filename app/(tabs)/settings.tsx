import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { RESET_NOTIFICATION_TRACKING } from "@/graphql/map/queries";
import { useMutation } from "@apollo/client";
import { useTextSize } from "@/contexts/TextSizeContext";
import { auth } from "@/firebaseConfig";
import { GET_USER } from "@/graphql/user/queries";
import { useQuery } from "@apollo/client";
import { ScrollView } from "react-native-gesture-handler";

const LogoutButton = () => {
  const { logout, loading } = useLogout();
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <Text
      onPress={logout}
      style={{
        color: "#fff",
        padding: 10,
        fontFamily: "Comfortaa",
        fontSize: 15 * textScaleFactor,
      }}
    >
      {loading ? "Logging out..." : "Logout"}
    </Text>
  );
};

const ResetTrackingButton = () => {
  const [resetNotificationTracking, { loading }] = useMutation(
    RESET_NOTIFICATION_TRACKING
  );

  const handleResetTracking = async () => {
    try {
      const { data } = await resetNotificationTracking();
      if (data.resetNotificationTracking) {
        Alert.alert("Success", "Tracking reset successfully.");
      } else {
        Alert.alert("Error", "Failed to reset tracking.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message || "Failed to reset tracking.");
      } else {
        Alert.alert("Error", "Failed to reset tracking.");
      }
    }
  };
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <Text
      onPress={handleResetTracking}
      style={{
        color: "#fff",
        padding: 10,
        fontFamily: "Comfortaa",
        fontSize: 15 * textScaleFactor,
      }}
    >
      {loading ? "Resetting..." : "Reset Tracking"}
    </Text>
  );
};

const Settings = () => {
  const { theme, setTheme, currentColors } = useTheme();
  const { isLargeText, toggleTextSize, textScaleFactor } = useTextSize();
  const toggleSwitch = () => setTheme(theme === "light" ? "dark" : "light");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(false);

  const currentUser = auth.currentUser;
  const skipQuery = !currentUser?.uid;

  const {
    data: currentUserDetails,
    loading: currentUserLoading,
    error: currentUserError,
  } = useQuery(GET_USER, {
    skip: skipQuery,
    variables: { id: currentUser?.uid || "" },
  });

  return (
    <ScrollView>
    <View
      style={[styles.settingsContainer, { backgroundColor: currentColors.background }]}
    >
      {/* User information */}
      <View style={styles.userInfo}>
        {currentUserDetails?.getUser?.imageUrl && (
          <Image
            source={{
              uri: currentUserDetails?.getUser?.imageUrl || undefined,
            }}
            style={styles.profileImage}
          />
        )}
        <Text style={[styles.userName, {color: currentColors.text}]}>
          {`${currentUserDetails?.getUser?.firstName || "User"} ${
            currentUserDetails?.getUser?.lastName || "Name"
          }`}
        </Text>
        
      </View>

      <Text style={[styles.sectionHeader, {color: currentColors.icon}]}>Account Settings</Text>
      <View style={[styles.settingsBubble, {backgroundColor: currentColors.placeholder}]}>
        
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]} onPress={() => setIsNotificationsEnabled(!isNotificationsEnabled)}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={setIsNotificationsEnabled}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]} onPress={() => toggleSwitch()}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Dark Mode</Text>
          <Switch value={theme === "dark"} onValueChange={toggleSwitch} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]} onPress={() => setIsHapticsEnabled(!isHapticsEnabled)}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Sound & Haptics</Text>
          <Switch
            value={isHapticsEnabled}
            onValueChange={setIsHapticsEnabled}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionHeader, {color: currentColors.icon}]}>More Support</Text>
      <View style={[styles.settingsBubble, {backgroundColor: currentColors.placeholder}]}>
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Terms and Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, {borderBottomColor: currentColors.tint}]}>
          <Text style={[styles.settingText, {color: currentColors.text}]}>Share Relay with Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <LinearGradient
        colors={["#ff8833", "#e24a4a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <LogoutButton />
      </LinearGradient>

      {/* Reset Tracking Button */}
      <LinearGradient
        colors={["#ff8833", "#e24a4a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <ResetTrackingButton />
      </LinearGradient>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontFamily: "Comfortaa-bold",
  },
  settingsBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    paddingTop: -1
  },
  sectionHeader: {
    fontSize: 18,
    // fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Comfortaa-bold",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  settingText: {
    fontSize: 16,
    fontFamily: "Comfortaa",
  },
  gradientButton: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Settings;
