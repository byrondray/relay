import { Button } from "@ui-kitten/components";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TimeIcon from "@/assets/images/timeIcon.svg";
import Trash from "@/assets/images/trach_icon.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import StackedProfilePictures from "./stackedProfile";
import RepeatIcon from "@/assets/images/repeat.svg";
import ArrowUp from "@/assets/images/arrow-up.svg";

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
        height: 200,
        backgroundColor: "#FFFFFF",
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
          <Text style={{ fontSize: 10, alignSelf: "center" }}>RN: {id}</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {state === "pending" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  backgroundColor: "#3366FF",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderWidth: 0,
                  marginRight: 8,
                }}
              >
                <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
                <Text style={{ color: "#fff", alignSelf: "center" }}>
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
                  backgroundColor: "#D2D2D2",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderWidth: 0,
                  marginRight: 8,
                }}
              >
                <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
                <Text style={{ color: "#fff", alignSelf: "center" }}>
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
            color: "#666666",
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: 0.2,
          }}
        >
          {formatThisDate}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <OrangeMarker
            width={20}
            height={20}
            style={{ marginRight: 8, width: 120 }}
          />
          <Text>{startLocation}</Text>
          <Text style={{ marginLeft: "auto", color: "#FF6A00" }}>
            Est: {startTime}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text>{endLocation}</Text>
          <Text style={{ marginLeft: "auto", color: "#E24949" }}>
            Est: {endTime}
          </Text>
        </View>

        <StackedProfilePictures images={images} />

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
              <Text style={{ color: "#FF6A00" }}>{recurrence}</Text>
            </>
          ) : (
            <>
              <ArrowUp width={16} height={16} style={{ marginRight: 10 }} />
              <Text style={{ color: "#FF6A00" }}>{recurrence}</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ActiveRiderCard;
