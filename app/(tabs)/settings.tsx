import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { useTextSize } from "@/contexts/TextSizeContext";

const LogoutButton = () => {
  const { logout, loading } = useLogout();

  return (
    <Text onPress={logout} style={{ color: "#fff", padding: 10 }}>
      {loading ? "Logging out..." : "Logout"}
    </Text>
  );
};

const Settings = () => {
  const { theme, setTheme, currentColors } = useTheme();
  const { isLargeText, toggleTextSize, textScaleFactor } = useTextSize();
  const toggleSwitch = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.header, { color: currentColors.text, fontSize: 24 * textScaleFactor }]}>
        Settings
      </Text>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text, fontSize: 18 * textScaleFactor }]}>
          Enable Notifications
        </Text>
        <Switch value={false} onValueChange={() => {}} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text, fontSize: 18 * textScaleFactor }]}>
          Dark Mode
        </Text>
        <Switch value={theme === "dark"} onValueChange={toggleSwitch} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text, fontSize: 18 * textScaleFactor }]}>
          Large Text
        </Text>
        <Switch value={isLargeText} onValueChange={toggleTextSize} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text, fontSize: 18 * textScaleFactor }]}>
          Location Access
        </Text>
        <Switch value={false} onValueChange={() => {}} />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: currentColors.text, fontSize: 18 * textScaleFactor }]}>
          Haptics
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Comfortaa-bold"
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
    fontFamily: "Comfortaa",
  },
});

export default Settings;
