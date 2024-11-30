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

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 200,
        backgroundColor: currentColors.background,
        paddingHorizontal: 20,
        width: "100%",
      }}
    >
      {/* Driver Image */}
      <View style={{ alignItems: "center", marginRight: 20, marginBottom: 50 }}>
        {driverData?.imageUrl && (
          <Image
            source={{ uri: driverData.imageUrl }}
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
              fontFamily: "Comfortaa-Bold",
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
            fontWeight: "bold",
            color: "#8F9BB3", // Using theme color
            fontFamily: "Comfortaa",
            marginBottom: 4,
          }}
        >
          Driver
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 5,
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa-Bold",
          }}
        >
          {driverData?.firstName[0].toUpperCase()}
          {driverData?.firstName.slice(1)} {driverData?.lastName}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#8F9BB3", // Using theme color
            fontFamily: "Comfortaa",
            marginBottom: 4,
          }}
        >
          Car Plate
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 5,
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa-Bold",
          }}
        >
          {vehicleData?.licensePlate}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#8F9BB3", // Using theme color
            fontFamily: "Comfortaa",
            marginBottom: 4,
          }}
        >
          Vehicle Model
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: currentColors.text, // Using theme color
            fontFamily: "Comfortaa-Bold",
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
