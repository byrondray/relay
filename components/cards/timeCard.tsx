import React from "react";
import { View, Text } from "react-native";

interface TimeCardProps {
  startTime: string;
  endTime: string;
}

const TimeCard = ({ startTime, endTime }: TimeCardProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: 398,
          height: 86,
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: "#666666",
              marginBottom: 5,
            }}
          >
            Start time (Estimated time)
          </Text>
          <Text
            style={{
              fontSize: 40,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: "#FB812A",
              textAlign: "center",
              letterSpacing: 0.4,
            }}
          >
            {startTime}
          </Text>
        </View>

        <View
          style={{
            width: 1,
            height: "100%",
            backgroundColor: "#CCCCCC",
          }}
        />

        <View
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: "#666666",
              marginBottom: 5,
            }}
          >
            Arrival time (Estimated time)
          </Text>
          <Text
            style={{
              fontSize: 40,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: "#E24949",
              textAlign: "center",
              letterSpacing: 0.4,
            }}
          >
            {endTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TimeCard;
