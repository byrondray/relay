import React from "react";
import { Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import StaticChildSelector from "./staticChildSelector";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@ui-kitten/components";

const CarpoolOverview = ({
  startingAddress,
  endingAddress,
  selectedDate,
  time,
  selectedChildren,
  description,
}: {
  startingAddress: string;
  endingAddress: string;
  selectedDate: Date;
  time: string;
  selectedChildren: string[];
  description: string;
}) => {
  const textColor = useThemeColor({}, "placeholder");
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(selectedDate);

  const formattedDateTime = `${formattedDate}, ${time}`;
  return (
    <View
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#80CCDDEE",
        borderRadius: 15,
        width: "100%",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingTop: 20,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 20,
            fontWeight: "bold",
            fontFamily: "Comfortaa",
          }}
        >
          Request overview
        </Text>
        {/* <Close width={20} height={20} /> This is invisible */}
      </View>

      <LinearGradient
        colors={["#ff8833", "#e24a4a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          borderRadius: 25,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <Button
          style={{
            width: "100%",
            paddingVertical: 12,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Comfortaa",
            }}
          >
            Accept this Request
          </Text>
        </Button>
      </LinearGradient>

      <Text style={{ fontFamily:  "Comfortaa-Regular", color: textColor }}>
        Scheduled
      </Text>
      <Text
        style={{
          fontFamily:  "Comfortaa-Regular",
          color: "#2E3A59",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        One time
      </Text>
      <Text style={{ fontFamily: "Comfortaa-Regular", color: textColor }}>From</Text>
      <Text
        style={{
          fontFamily: "Comfortaa-Regular",
          color: "#2E3A59",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {startingAddress}
      </Text>
      <Text style={{ fontFamily: "Comfortaa-Regular", color: textColor }}>To</Text>
      <Text
        style={{
          fontFamily: "Comfortaa-Regular",
          color: "#2E3A59",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {endingAddress}
      </Text>
      <Text style={{ fontFamily: "Comfortaa-Regular", color: textColor }}>
        Date & Time of Ride
      </Text>
      <Text
        style={{
          fontFamily: "Comfortaa-Regular",
          color: "#2E3A59",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {formattedDateTime}
      </Text>
      <Text
        style={{ fontFamily: "Comfortaa", color: textColor, marginBottom: 15 }}
      >
        Seats Required
      </Text>
      <StaticChildSelector selectedChildren={selectedChildren} />
      <Text
        style={{ fontFamily: "Comfortaa", color: textColor, marginTop: 15 }}
      >
        Selected Group To Post Request
      </Text>
      <Text
        style={{
          fontFamily: "Comfortaa",
          color: "#2E3A59",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        Group 1
      </Text>
      <Text style={{ fontFamily: "Comfortaa", color: textColor }}>
        Description
      </Text>
      <Text
        style={{
          fontFamily: "Comfortaa",
          color: "#2E3A59",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {description}
      </Text>
    </View>
  );
};

export default CarpoolOverview;
