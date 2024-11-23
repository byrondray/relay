import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MessageCircle from "@/assets/images/message-circle.svg";
import HeartIcon from "@/assets/images/heart.svg";
import { useTheme } from "@/contexts/ThemeContext"; // Importing useTheme

interface DriverInfoProps {
  driverImage: string;
  driverName: string;
  carPlate: string;
  vehicleModel: string;
}

const DriverInfo = ({
  driverImage,
  driverName,
  carPlate,
  vehicleModel,
}: DriverInfoProps) => {
  const randomLikes = Math.floor(Math.random() * (750 - 50 + 1)) + 50;
  const { currentColors } = useTheme(); // Accessing theme colors

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 20,
        paddingLeft: 0,
      }}
    >
      <View style={{ alignItems: "center", marginRight: 20 }}>
        <Image
          source={{ uri: driverImage }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <HeartIcon width={14} height={14} style={{ marginRight: 1 }} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: "#FF6A00",
              fontFamily: "Comfortaa",
            }}
          >
            {randomLikes} likes
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#8F9BB3", // Using theme color
            fontFamily: "Comfortaa",
          }}
        >
          Driver
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            marginBottom: 5,
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa",
          }}
        >
          {driverName}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: currentColors.placeholder, // Using theme color
            fontFamily: "Comfortaa",
          }}
        >
          Car Plate
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            marginBottom: 5,
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa",
          }}
        >
          {carPlate}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa",
          }}
        >
          Vehicle Model
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa",
          }}
        >
          {vehicleModel}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          backgroundColor: currentColors.background,
          borderRadius: 26,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
        onPress={() => {
          console.log("Button Pressed");
        }}
      >
        <MessageCircle width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

export default DriverInfo;
