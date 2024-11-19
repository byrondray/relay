import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const PaymentInfo = ({}) => {
  const { currentColors } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        padding: 10,
        borderTopColor: currentColors.tint,
        borderTopWidth: 3,
        borderLeftColor: currentColors.placeholder,
        borderLeftWidth: 2,
        borderRightColor: currentColors.placeholder,
        borderRightWidth: 2,
        borderBottomColor: currentColors.placeholder,
        borderBottomWidth: 2,
        borderRadius: 10,
        backgroundColor: currentColors.placeholder,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: currentColors.text,
          padding: 7,
          fontFamily: "Comfortaa",
        }}
      >
        Please note that Relay does not handle payment processing. Any costs
        shared between users are arranged directly between them.
      </Text>
    </View>
  );
};

export default PaymentInfo;
