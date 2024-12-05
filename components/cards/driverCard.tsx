import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MessageCircle from "@/assets/images/message-circle.svg";
import HeartIcon from "@/assets/images/heart.svg";
import { useTheme } from "@/contexts/ThemeContext"; // Importing useTheme
import { auth } from "@/firebaseConfig"; // Firebase for checking current user
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import { Link, useRouter } from "expo-router";

const DriverInfo = ({
  driverData,
  vehicleData,
  carpoolData,
}: {
  driverData: User;
  vehicleData: Vehicle;
  carpoolData: CarpoolWithRequests;
}) => {
  const [randomLikes, setRandomLikes] = useState(0);

  useEffect(() => {
    setRandomLikes(Math.floor(Math.random() * (750 - 50 + 1)) + 50);
  }, []);

  const { currentColors } = useTheme();
  const router = useRouter();

  const getImageSource = (image: string | number) => {
    if (typeof image === "string") {
      return { uri: image };
    }
    return image;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 0,
        paddingTop: 20,
        width: "100%",
        height: "auto",
        backgroundColor: currentColors.background,
      }}
    >
      {/* Driver Image */}
      <View style={{ alignItems: "center", marginRight: 20, marginBottom: 50 }}>
        {driverData?.imageUrl && (
          <Image
            source={getImageSource(driverData.imageUrl)}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          />
        )}

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
              fontFamily: "ComfortaaBold",
            }}
          >
            {randomLikes} likes
          </Text>
        </View>
      </View>

      {/* Driver Info */}
      <View style={{ flex: 1, marginTop: -15 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#8F9BB3", // Using theme color
            fontFamily: "ComfortaaBold",
            marginBottom: 4,
          }}
        >
          Driver
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 8,
            color: currentColors.text, // Using theme color
            fontFamily: "ComfortaaBold",
            lineHeight: 22,
          }}
        >
          {driverData?.firstName[0].toUpperCase()}
          {driverData?.firstName.slice(
            1
          )} {driverData?.lastName}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#8F9BB3", // Using theme color
            fontFamily: "ComfortaaBold",
            marginBottom: 4,
          }}
        >
          Car Plate
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 8,
            color: currentColors.text, // Using theme color
            fontFamily: "ComfortaaBold",
            lineHeight: 22,
          }}
        >
          {vehicleData?.licensePlate}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#8F9BB3", // Using theme color
            fontFamily: "ComfortaaBold",
            marginBottom: 4,
          }}
        >
          Vehicle Model
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 8,
            color: currentColors.text, // Using theme color
            fontFamily: "ComfortaaBold",
            lineHeight: 22,
          }}
        >
          {vehicleData?.model}
        </Text>
      </View>

      {driverData?.id !== auth.currentUser?.uid && (
        <Link
          href={{
            pathname: "/messages/[userId]",
            params: { userId: driverData?.id },
          }}
          asChild
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FB812A",
              borderRadius: 26,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              marginBottom: 80,
            }}
          >
            <MessageCircle width={24} height={24} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

export default DriverInfo;
