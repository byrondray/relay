import React from "react";
import { View, Text } from "react-native";

const GpsTrackingInfo = () => {
  return (
    <View
      style={{
        width: "100%",
        padding: 20,
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
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: "#151A30",
          marginBottom: 10,
          fontFamily: "Comfortaa",
        }}
      >
        Note: GPS tracking starts when you press 'Start Ride' and stops at the
        end of the ride.
      </Text>
    </View>
  );
};

export default GpsTrackingInfo;
