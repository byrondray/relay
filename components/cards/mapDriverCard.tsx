import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import LikeIcon from "@/assets/images/heart.svg";
import ClockIcon from "@/assets/images/whiteClock.svg";
import DriverIcon from "@/assets/images/drives.svg";
import TimeCard from "./timeCard";
import StackedProfilePictures from "./stackedProfile";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import { useTheme } from "@/contexts/ThemeContext"; 
import PhoneIcon from "@/assets/images/phone.svg";
import MessageCircle from "@/assets/images/message-circle.svg";
import Pin from "@/assets/images/pin.svg";

interface ScheduleActiveCardProps {
  id: string;
  driverName: string;
  driveCount: number;
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
  const isToday = today.toDateString() === date.toDateString();

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return isToday ? `Today, ${formattedDate}` : formattedDate;
};

const MapDriverCard = ({
  id,
  driverName,
  driveCount,
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
        shadowColor: currentColors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 15,
        backgroundColor: currentColors.background,
        padding: 16,
        width: "100%",
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
            fontFamily: "Comfortaa",
            fontWeight: "700",
            color: currentColors.text,
          }}
        >
          RN: {id}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: currentColors.tint,
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
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: currentColors.text,
            }}
          >
            Processing
          </Text>
        </TouchableOpacity>
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
          <DriverIcon width={13} height={13} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: currentColors.tint,
            }}
          >
            {driveCount} Drives
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Comfortaa",
            fontWeight: "500",
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
          <LikeIcon width={13} height={13} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Comfortaa",
              fontWeight: "700",
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
            fontSize: 20,
            fontFamily: "Comfortaa",
            fontWeight: "700",
            color: currentColors.text,
            letterSpacing: 0.2,
          }}
        >
          {formatDate(date)}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Comfortaa",
            fontWeight: "700",
            color: currentColors.tint,
          }}
        >
          {duration}
        </Text>
      </View>

      <TimeCard startTime={startTime} endTime={endTime} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <OrangeMarker
          width={20}
          height={20}
          style={{ marginRight: 8 }}
        />
        <Text
          style={{ fontFamily: "Comfortaa", color: currentColors.text, fontSize: 14 }}
        >
          {startLocation}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
        <Text
          style={{ fontFamily: "Comfortaa", color: currentColors.text, fontSize: 14 }}
        >
          {endLocation}
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
              backgroundColor: currentColors.background,
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
              backgroundColor: currentColors.background,
              borderRadius: 26,
              padding: 8,
              marginStart: 10,
            }}
          >
            <MessageCircle width={24} height={24} style={{ padding: 10 }}/>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: currentColors.background,
              borderRadius: 26,
              padding: 8,
              marginStart: 10,
            }}
          >
            <Pin width={24} height={24} style={{ padding: 10 }}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapDriverCard;
