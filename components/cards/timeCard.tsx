import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PlacementOptions } from "@ui-kitten/components/ui/popover/type";

interface TimeCardProps {
  startTime: string;
  endTime: string;
}

const TimeCard = ({ startTime, endTime }: TimeCardProps) => {
  console.log(startTime, endTime);
  const { currentColors } = useTheme();

  const splitStartTime = startTime.split(" ");
  const splitEndTime = endTime.split(" ");

  const startTimeValue = splitStartTime.slice(0, 2).join(" ");
  const startPeriod = splitStartTime[2].toLowerCase();

  const endTimeValue = splitEndTime.slice(0, 2).join(" ");
  const endPeriod = splitEndTime[2].toLowerCase();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 86,
          backgroundColor: currentColors.background,
          borderRadius: 12,
          shadowColor: currentColors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
          paddingHorizontal: 20,
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            marginRight: 10,
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
              fontSize: 35,
              fontFamily: "Comfortaa-Bold",
              fontWeight: "700",
              color: "#FB812A",
              textAlign: "center",
              letterSpacing: 0.4,
            }}
          >
            {startTimeValue}
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Comfortaa",
                fontWeight: "normal",
              }}
            >
              {startPeriod}
            </Text>
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
            marginLeft: 10,
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
              fontSize: 35,
              fontFamily: "Comfortaa-Bold",
              fontWeight: "700",
              color: "#E24949",
              textAlign: "center",
              letterSpacing: 0.4,
            }}
          >
            {endTimeValue}
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Comfortaa",
                fontWeight: "normal",
              }}
            >
              {endPeriod}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TimeCard;
