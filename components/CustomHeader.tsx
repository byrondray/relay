import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

function CustomHeader({ recipientName }: { recipientName: string }) {
  const router = useRouter();
  const { currentColors } = useTheme();

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: currentColors.background },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          router.canGoBack()
            ? router.back()
            : router.push("/Community/community")
        }
        style={styles.backButton}
      >
        <Text style={[styles.backText, { color: currentColors.tint }]}>
          {"< Back"}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: currentColors.text }]}>
        {recipientName || "Message"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CustomHeader;
