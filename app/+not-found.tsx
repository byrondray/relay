import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme to access current colors

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  const { currentColors } = useTheme(); // Get current theme colors from context

  return (
    <ThemedView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <ThemedText style={{ color: currentColors.text }} type="title">
        This screen doesn't exist.
      </ThemedText>
      <Link href="/" style={[styles.link, { borderColor: currentColors.tint }]}>
        <ThemedText style={{ color: currentColors.tint }} type="link">
          Go to home screen!
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    borderBottomWidth: 1, // Border for the link text
  },
});
