import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PlacementOptions } from "@ui-kitten/components/ui/popover/type";

interface TimeCardProps {
  startTime: string;
  endTime: string;
}

const TimeCard = ({ startTime, endTime }: TimeCardProps) => {
  const { currentColors } = useTheme();
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
          height: 86,
          backgroundColor: currentColors.background,
          borderRadius: 12,
          shadowColor: currentColors.text,
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
            marginRight: 10,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: currentColors.placeholder,
              marginBottom: 5,
            }}
          >
            Start time (Estimated time)
          </Text>
          <Text
            style={{
              fontSize: 35,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: "#tint",
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
            backgroundColor: currentColors.background,
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
              color: currentColors.placeholder,
              marginBottom: 5,
            }}
          >
            Arrival time (Estimated time)
          </Text>
          <Text
            style={{
              fontSize: 35,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: currentColors.tint,
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
