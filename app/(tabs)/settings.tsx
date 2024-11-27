import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { RESET_NOTIFICATION_TRACKING } from "@/graphql/map/queries";
import { useMutation } from "@apollo/client";

const LogoutButton = () => {
  const { logout, loading } = useLogout();

  return (
    <Text onPress={logout} style={{ color: "#fff", padding: 10 }}>
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

  return (
    <Text onPress={handleResetTracking} style={{ color: "#fff", padding: 10 }}>
      {loading ? "Resetting..." : "Reset Tracking"}
    </Text>
  );
};

const Settings = () => {
  const { theme, setTheme, currentColors } = useTheme();
  const toggleSwitch = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <Text style={[styles.header, { color: currentColors.text }]}>
        Settings
      </Text>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>
          Enable Notifications
        </Text>
        <Switch value={false} onValueChange={() => {}} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>
          Dark Mode
        </Text>
        <Switch value={theme === "dark"} onValueChange={toggleSwitch} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>
          Location Access
        </Text>
        <Switch value={false} onValueChange={() => {}} />
      </View>

      <LinearGradient
        colors={["#ff8833", "#e24a4a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          borderRadius: 15,
          overflow: "hidden",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <LogoutButton />
      </LinearGradient>

      <LinearGradient
        colors={["#ff8833", "#e24a4a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          borderRadius: 15,
          overflow: "hidden",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <ResetTrackingButton />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  settingText: {
    fontSize: 18,
  },
});

export default Settings;
