import DriverIcon from "@/assets/images/drives.svg";
import LikeIcon from "@/assets/images/heart.svg";
import MessageCircle from "@/assets/images/message-circle.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import PhoneIcon from "@/assets/images/phone.svg";
import Pin from "@/assets/images/pin.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import ClockIcon from "@/assets/images/whiteClock.svg";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import StackedProfilePictures from "./stackedProfile";
import TimeCard from "./timeCard";

interface ScheduleActiveCardProps {
  id: string;
  driverName: string;
  driveCount: number;
  driverImage: string | null | undefined;
  likes: number;
  date: Date;
  duration: string;
  startLocation: string;
  startTime: string;
  endLocation: string;
  endTime: string;
  passengerImages: string[];
}

const formatDate = (date: Date): string => {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffTime > 0) {
    return "Future";
  }

  if (diffTime < 0 && diffDays !== 0) {
    return `${Math.abs(diffDays)} days ago`;
  }

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  return `Today, ${formattedDate}`;
};

const MapDriverCard = ({
  id,
  driverName,
  driveCount,
  driverImage,
  likes,
  date,
  duration,
  startLocation,
  startTime,
  endLocation,
  endTime,
  passengerImages,
}: ScheduleActiveCardProps) => {
  const { currentColors } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const makeCall = () => {
    if (Platform.OS === "android") {
      Linking.openURL("tel:1234567890");
    } else {
      Linking.openURL("telprompt:1234567890");
    }
  };

  return (
    <View
      style={{
        marginHorizontal: 16,
        shadowColor: currentColors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 15,
        backgroundColor: currentColors.background,
        padding: 20,
        width: screenWidth - 32,
        flex: 1,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: "ComfortaaBold",
            letterSpacing: 0.2,
            color: currentColors.text,
          }}
        >
          RN: {id.slice(0, 8).toUpperCase()}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#35BA00",
            borderRadius: 16,
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ClockIcon width={16} height={16} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "ComfortaaMedium",
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            Processing
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10, }}>
        <Text style={{
        width: "100%",
        textAlign: "center",
        fontSize: 16,
        fontFamily: "ComfortaaBold",
        fontWeight: "600",
        letterSpacing: -0.3,
        color: "#666666",
        }}>Driver</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: driverImage || undefined }}
          style={{ width: 100, height: 100, borderRadius: 100 }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <DriverIcon width={17} height={17} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "ComfortaaBold",
              fontWeight: "600",
              color: currentColors.tint,
            }}
          >
            {driveCount} Drives
          </Text>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontFamily: "ComfortaaBold",
            fontWeight: "600",
            color: currentColors.text,
            textAlign: "center",
            flex: 2,
          }}
          numberOfLines={1}
        >
          {driverName}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <LikeIcon width={17} height={17} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "ComfortaaBold",
              fontWeight: "600",
              color: currentColors.tint,
            }}
          >
            {likes} Likes
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontFamily: "ComfortaaBold",
            fontWeight: "600",
            color: "#666666",
            letterSpacing: -0.8,
          }}
        >
          {formatDate(new Date())}
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontSize: 12,
            fontFamily: "ComfortaaBold",
            fontWeight: "600",
            color: "#666666",
          }}
        >
          {duration}
        </Text>
      </View>

      <TimeCard startTime="08: 30 AM" endTime="09: 32 AM" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 6,
          marginTop: 10,
        }}
      >
        <OrangeMarker width={20} height={20} style={{ marginRight: 8 }} />
        <Text
          style={{
            fontFamily: "ComfortaaRegular",
            color: currentColors.text,
            fontSize: 14,
          }}
        >
          {startLocation.length > 30
            ? `${startLocation.slice(0, 30)}...`
            : startLocation}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, }}>
        <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
        <Text
          style={{
            fontFamily: "ComfortaaRegular",
            color: currentColors.text,
            fontSize: 14,
          }}
        >
          {endLocation.length > 30
            ? `${endLocation.slice(0, 30)}...`
            : endLocation}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Comfortaa",
          color: currentColors.text,
          fontSize: 10,
          marginTop: 10,
        }}
      >
        Passengers
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginTop: 10,
        }}
      >
        <StackedProfilePictures images={passengerImages} />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FB812A",
              borderRadius: 26,
              padding: 8,
            }}
            onPress={makeCall}
          >
            <PhoneIcon width={24} height={24} style={{ padding: 10 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FB812A",
              borderRadius: 26,
              padding: 8,
              marginStart: 8,
            }}
          >
            <MessageCircle width={24} height={24} style={{ padding: 10 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FB812A",
              borderRadius: 26,
              padding: 8,
              marginStart: 8,
            }}
          >
            <Pin width={24} height={24} style={{ padding: 10 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapDriverCard;
