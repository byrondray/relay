import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MessageCircle from "@/assets/images/message-circle.svg";
import HeartIcon from "@/assets/images/heart.svg";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  const textColor = useThemeColor({}, "placeholder");
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
            color: textColor,
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
            fontFamily: "Comfortaa",
          }}
        >
          {driverName}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: textColor,
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
            fontFamily: "Comfortaa",
          }}
        >
          {carPlate}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: textColor,
            fontFamily: "Comfortaa",
          }}
        >
          Vehicle Model
        </Text>
        <Text
          style={{ fontSize: 17, fontWeight: "700", fontFamily: "Comfortaa" }}
        >
          {vehicleModel}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#FB812A",
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
