import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TimeIcon from "@/assets/images/timeIcon.svg";
import Trash from "@/assets/images/trash.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import StackedProfilePictures from "./stackedProfile";
import RepeatIcon from "@/assets/images/repeat.svg";
import ArrowUp from "@/assets/images/arrow-up.svg";
import Clock from "@/assets/images/clock.svg";
import { useTheme } from "@/contexts/ThemeContext";
import DriverInfo from "./driverCard";

interface CardData {
  id: string;
  state: "pending" | "timeout";
  date: Date;
  startLocation: string;
  startTime: string;
  endLocation: string;
  endTime: string;
  images: string[];
  recurrence: "one time" | "recurring";
}

const ScheduleActiveCard = ({
  id,
  state,
  date,
  startLocation,
  startTime,
  endLocation,
  endTime,
  images,
  recurrence,
}: CardData) => {
  const isodate = new Date(date);

  const formatThisDate = isodate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { currentColors } = useTheme();

  const driverData = {
    driverImage:
      "https://assets.crowdstrike.com/is/image/crowdstrikeinc/kevin-boehm3?ts=1726842946671&dpr=off",
    driverName: "John Doe",
    carPlate: "ABC-123",
    vehicleModel: "Tesla Model 3",
  };

  return (
    <View
      style={{
        shadowColor: currentColors.placeholder,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: currentColors.tint,
        borderRadius: 15,
        width: "100%",
        backgroundColor: currentColors.background,
        paddingHorizontal: 16,
        paddingVertical: 15,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              alignSelf: "center",
              fontFamily: "Comfortaa",
              color: currentColors.text,
            }}
          >
            RN: {id.slice(0, 8)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: currentColors.background,
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 10,
            }}
          >
            {recurrence === "recurring" ? (
              <>
                <RepeatIcon
                  width={16}
                  height={16}
                  style={{ marginHorizontal: 10 }}
                />
                <Text
                  style={{
                    color: currentColors.tint,
                    fontFamily: "Comfortaa",
                  }}
                >
                  {recurrence}
                </Text>
              </>
            ) : (
              <>
                <ArrowUp width={16} height={16} style={{ marginRight: 10 }} />
                <Text
                  style={{
                    color: currentColors.tint,
                    fontFamily: "Comfortaa",
                  }}
                >
                  {recurrence}
                </Text>
              </>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: currentColors.background,
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 10,
            }}
          >
            <Clock
              width={16}
              height={16}
              style={{ marginLeft: 5, marginRight: 5 }}
            />
            <Text
              style={{
                color: currentColors.text,
                fontFamily: "Comfortaa",
              }}
            >
              Confirmed
            </Text>
          </View>
        </View>
        <DriverInfo {...driverData} />
        <Text
          style={{
            color: currentColors.text,
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: 0.2,
            marginBottom: 6,
            fontFamily: "Comfortaa",
          }}
        >
          {formatThisDate}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <OrangeMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
            {startLocation}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: currentColors.tint,
              fontFamily: "Comfortaa",
            }}
          >
            Est: {startTime}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
            {endLocation}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: currentColors.tint || "#E24949",
              fontFamily: "Comfortaa",
            }}
          >
            Est: {endTime}
          </Text>
        </View>

        <StackedProfilePictures images={images} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-end",
          alignItems: "center",
          backgroundColor: currentColors.background,
          borderRadius: 16,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: currentColors.background,
            paddingHorizontal: 40,
            paddingVertical: 6,
            borderRadius: 16,
          }}
          onPress={() => {
            console.log("Read More pressed");
          }}
        >
          <Text
            style={{
              color: currentColors.background,
              fontFamily: "Comfortaa",
            }}
          >
            Read More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScheduleActiveCard;
