import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const MapAiInfo = () => {
  const { currentColors } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        padding: 20,
        borderTopColor: currentColors.tint,
        borderTopWidth: 3,
        borderLeftColor: currentColors.placeholder,
        borderLeftWidth: 2,
        borderRightColor: currentColors.placeholder,
        borderRightWidth: 2,
        borderBottomColor: currentColors.placeholder,
        borderBottomWidth: 2,
        borderRadius: 10,
        backgroundColor: currentColors.background,
        marginTop: 20,
      }}
    >
      {/* Title */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: currentColors.text,
          marginBottom: 10,
          fontFamily: "Comfortaa"
        }}
      >
        Route Auto-Match
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 14,
          color: currentColors.text,
          marginBottom: 10,
          fontFamily: "Comfortaa"
        }}
      >
        Here are some carpool requests with routes matched to you according to
        our AI module.
      </Text>

      {/* Divider */}
      <View
        style={{
          marginTop: 10,
          borderTopColor: currentColors.placeholder,
          borderTopWidth: 1,
          width: "100%",
        }}
      />

      {/* Additional Info */}
      <Text
        style={{
          fontSize: 14,
          color: currentColors.text,
          marginTop: 10,
          fontFamily: "Comfortaa"
        }}
      >
        Routes will adjust based on selected passengers.
      </Text>
    </View>
  );
};

export default MapAiInfo;
