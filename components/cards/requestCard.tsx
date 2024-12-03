import ArrowUp from "@/assets/images/arrow-up.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import RepeatIcon from "@/assets/images/repeat.svg";
import TimeIcon from "@/assets/images/timeIcon.svg";
import Trash from "@/assets/images/trach_icon.svg";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import StackedProfilePictures from "./stackedProfile";

interface CardData {
  id: string;
  state: "confirmed" | "timeout";
  date: Date;
  startLocation: string;
  startTime: string;
  endLocation: string;
  endTime: string;
  images: string[];
  recurrence: "one time" | "recurring";
}

const ActiveRiderCard = ({
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
  const { currentColors } = useTheme();

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
        height: 200,
        backgroundColor: currentColors.background,
        paddingHorizontal: 16,
        paddingVertical: 15,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
            RN: {id.slice(0, 8)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {state === "confirmed" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  backgroundColor: currentColors.background,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderWidth: 0,
                  marginRight: 8,
                }}
              >
                <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
                <Text
                  style={{
                    color: "#fff",
                    alignSelf: "center",
                    fontFamily: "Comfortaa",
                  }}
                >
                  {state}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  backgroundColor: currentColors.background,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderWidth: 0,
                  marginRight: 8,
                }}
              >
                <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
                <Text
                  style={{
                    color: currentColors.text,
                    alignSelf: "center",
                    fontFamily: "Comfortaa",
                  }}
                >
                  {state}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => {}}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Trash width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            color: currentColors.placeholder,
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
              color: currentColors.tint,
              fontFamily: "Comfortaa",
            }}
          >
            Est: {endTime}
          </Text>
        </View>

        <StackedProfilePictures images={images} />

        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            alignItems: "center",
            backgroundColor: currentColors.background,
            borderRadius: 16,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 0,
            marginTop: 10,
          }}
        >
          {recurrence === "one time" ? (
            <>
              <RepeatIcon
                width={16}
                height={16}
                style={{ marginHorizontal: 10 }}
              />
              <Text
                style={{ color: currentColors.tint, fontFamily: "Comfortaa" }}
              >
                {recurrence}
              </Text>
            </>
          ) : (
            <>
              <ArrowUp width={16} height={16} style={{ marginRight: 10 }} />
              <Text
                style={{ color: currentColors.tint, fontFamily: "Comfortaa" }}
              >
                {recurrence}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ActiveRiderCard;
