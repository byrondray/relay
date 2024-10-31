import React from "react";
import { View, Text } from "react-native";

const PaymentInfo = ({}) => {
  return (
    <View
      style={{
        width: "100%",
        padding: 10,
        borderTopColor: "#FF8833",
        borderTopWidth: 3,
        borderLeftColor: "#EDF1F7",
        borderLeftWidth: 2,
        borderRightColor: "#EDF1F7",
        borderRightWidth: 2,
        borderBottomColor: "#EDF1F7",
        borderBottomWidth: 2,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginTop: 20,
      }}
    >
      <Text style={{ fontSize: 16, color: "#222B45", padding: 7 }}>
        Please note that Relay does not handle payment processing. Any costs
        shared between users are arranged directly between them.
      </Text>
    </View>
  );
};

export default PaymentInfo;
