import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLogout } from "@/hooks/auth/useLogout";

const LogoutButton = () => {
  const { logout, loading } = useLogout();

  return (
    <Text onPress={logout} style={{ color: "#fff", padding: 10 }}>
      {loading ? "Logging out..." : "Logout"}
    </Text>
  );
};

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch value={false} onValueChange={() => {}} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch value={false} onValueChange={() => {}} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Location Access</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
