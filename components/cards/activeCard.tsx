import { Button } from "@ui-kitten/components";
import React from "react";
import { View, Text } from "react-native";
import TimeIcon from "@/assets/images/timeIcon.svg";
import Trash from "@/assets/images/trash.svg";
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
        width: 398,
        height: 200,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 15,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingVertical: 15 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ marginTop: 5 }}>RN: {id}</Text>

          {state === "pending" ? (
            <Button
              onPress={() => {}}
              style={{
                width: 120,
                height: 28,
                backgroundColor: "#3366FF",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderWidth: 0,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TimeIcon style={{}} />
                <Text style={{ color: "#fff", lineHeight: 28 }}>{state}</Text>
              </View>
            </Button>
          ) : (
            <Button
              onPress={() => {}}
              style={{
                width: 120,
                height: 28,
                backgroundColor: "#D2D2D2",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderWidth: 0,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TimeIcon width={16} height={16} style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", lineHeight: 28 }}>{state}</Text>
              </View>
            </Button>
          )}
          <Button
            onPress={() => {}}
            appearance="ghost"
            accessoryLeft={() => <Trash width={24} height={24} />}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
            }}
          />
        </View>

        <Text>{formatThisDate}</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <OrangeMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text>{startLocation}</Text>
          <Text style={{ marginLeft: "auto" }}>Est: {startTime}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text>{endLocation}</Text>
          <Text style={{ marginLeft: "auto" }}>Est: {endTime}</Text>
        </View>

        <StackedProfilePictures images={images} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            marginTop: 10,
          }}
        >
          {recurrence === "one time" ? (
            <Button
              onPress={() => {}}
              style={{
                width: 120,
                height: 28,
                backgroundColor: "rgba(255, 136, 51, 0.1)",
                borderRadius: 16,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 0,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <RepeatIcon
                  width={16}
                  height={16}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "#FF6A00" }}>{recurrence}</Text>
              </View>
            </Button>
          ) : (
            <Button
              onPress={() => {}}
              style={{
                width: 104,
                height: 26,
                backgroundColor: "rgba(255, 136, 51, 0.1)",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 0,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <ArrowUp width={16} height={16} style={{ marginRight: 10 }} />
                <Text style={{ color: "#FF6A00" }}>{recurrence}</Text>
              </View>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default ActiveRiderCard;
