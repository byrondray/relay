import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PlacementOptions } from "@ui-kitten/components/ui/popover/type";

interface TimeCardProps {
  startTime: string;
  endTime: string;
}

const TimeCard = ({ startTime, endTime }: TimeCardProps) => {
  const { currentColors } = useTheme();

  const splitStartTime = startTime.split(" ");
  const splitEndTime = endTime.split(" ");

  const startTimeValue = splitStartTime.slice(0, 2).join("");
  const startPeriod = splitStartTime[2];

  const endTimeValue = splitEndTime.slice(0, 2).join("");
  const endPeriod = splitEndTime[2];

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 20,
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
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          shadowColor: currentColors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
          paddingHorizontal: 10,
          width: "50%",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginRight: 10,
            backgroundColor: "green",
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontFamily: "ComfortaaBold",
              color: currentColors.text,
              marginBottom: 5,
            }}
          >
            Start time (Estimated time)
          </Text>
          <Text
            style={{
              fontSize: 38,
              fontFamily: "ComfortaaBold",
              color: "#FB812A",
              textAlign: "center",
              lineHeight: 42,
              letterSpacing: -0.3,
              marginTop: 6,
              marginRight: 10,
            }}
          >
            {startTimeValue}
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Comfortaa",
                fontWeight: "normal",
                paddingLeft: 10,
              }}
            >
              {startPeriod}
            </Text>
          </Text>
        </View>
      </View>
      <View
          style={{
            width: 1,
            height: "100%",
            backgroundColor: "#f2f2f2",
          }}
        />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 86,
          backgroundColor: currentColors.background,
          borderRadius: 12,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          shadowColor: currentColors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
          paddingHorizontal: 10,
          width: "50%",
        }}
      >

        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontFamily: "ComfortaaBold",
              color: currentColors.text,
              marginBottom: 5,
            }}
          >
            Arrival time (Estimated time)
          </Text>

          <View style={{
            flexDirection: "row", 
            justifyContent: "flex-end",
            alignContent: "flex-end",
            width: "100%",
          }}>
            <Text
              style={{
                fontSize: 38,
                fontFamily: "ComfortaaBold",
                color: "#E24949",
                textAlign: "center",
                lineHeight: 42,
                letterSpacing: -0.3,
                marginTop: 6,
                marginRight: 10,
              }}
            >
            {endTimeValue}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "ComfortaaRegular",
                color: "#E24949",
                height: "100%",
              }}
            >
              {endPeriod}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TimeCard;
