import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext"

const ReviewInfo = () => {
  const { currentColors } = useTheme()
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
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: currentColors.text,
          marginBottom: 10,
          fontFamily: "Comfortaa",
        }}
      >
        Note: After your trip, please leave feedback and a like for your driver.
        Your input helps us improve. Thank you!
      </Text>
    </View>
  );
};

export default ReviewInfo;
