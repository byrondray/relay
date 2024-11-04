import React from "react";
import { View, Text } from "react-native";

const MapAiInfo = () => {
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
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#151A30",
          marginBottom: 10,
          fontFamily: "Comfortaa",
        }}
      >
        Route Auto-Match
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#151A30",
          marginBottom: 10,
          fontFamily: "Comfortaa",
        }}
      >
        Here are some carpool requests with routes matched to you according to
        our AI module.
      </Text>
      <View
        style={{
          marginTop: 10,
          borderTopColor: "#E4E9F2",
          borderTopWidth: 1,
          width: "100%",
        }}
      />
      <Text
        style={{
          fontSize: 14,
          color: "#151A30",
          marginTop: 10,
          fontFamily: "Comfortaa",
        }}
      >
        Routes will adjust based on selected passengers.
      </Text>
    </View>
  );
};

export default MapAiInfo;
