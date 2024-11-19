import { Button } from "@ui-kitten/components";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TimeIcon from "@/assets/images/timeIcon.svg";
import Trash from "@/assets/images/trash.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import StackedProfilePictures from "./stackedProfile";
import RepeatIcon from "@/assets/images/repeat.svg";
import ArrowUp from "@/assets/images/arrow-up.svg";
import DriverInfo from "./driverCard";
import Clock from "@/assets/images/clock.svg";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const isodate = new Date(date); // delete this later when db is connected cause I forget.

  const formatThisDate = isodate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const driverData = {
    driverImage:
      "https://assets.crowdstrike.com/is/image/crowdstrikeinc/kevin-boehm3?ts=1726842946671&dpr=off",
    driverName: "John Doe",
    carPlate: "ABC-123",
    vehicleModel: "Tesla Model 3",
  };
  const textColor = useThemeColor({}, "placeholder");

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
            }}
          >
            RN: {id}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255, 136, 51, 0.1)",
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 0,
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
                <Text style={{ color: "#FF6A00", fontFamily: "Comfortaa" }}>
                  {recurrence}
                </Text>
              </>
            ) : (
              <>
                <ArrowUp width={16} height={16} style={{ marginRight: 10 }} />
                <Text style={{ color: "#FF6A00", fontFamily: "Comfortaa" }}>
                  {recurrence}
                </Text>
              </>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFBB00",
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 0,
              marginTop: 10,
            }}
          >
            <Clock
              width={16}
              height={16}
              style={{ marginLeft: 5, marginRight: 5 }}
            />
            <Text style={{ color: "#001323", fontFamily: "Comfortaa" }}>
              Confirmed
            </Text>
          </View>
        </View>
        <DriverInfo {...driverData} />
        <Text
          style={{
            color: "#666666",
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
          <OrangeMarker
            width={20}
            height={20}
            style={{ marginRight: 8, width: 120 }}
          />
          <Text style={{ fontFamily: "Comfortaa", color: textColor }}>
            {startLocation}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: "#FF6A00",
              fontFamily: "Comfortaa",
            }}
          >
            Est: {startTime}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: "Comfortaa", color: textColor }}>
            {endLocation}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: "#E24949",
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
          backgroundColor: "rgba(255, 136, 51, 0.1)",
          borderRadius: 16,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 0,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#FF8833",
            paddingHorizontal: 40,
            paddingVertical: 6,
            borderRadius: 16,
          }}
          onPress={() => {
            console.log("Read More pressed");
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "Comfortaa" }}>
            Read More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScheduleActiveCard;
