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
import { useTheme } from "@/contexts/ThemeContext"; // Importing useTheme

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
  const { currentColors } = useTheme(); // Accessing theme colors

  const isodate = new Date(date); // delete this later when db is connected cause I forget.

  const formatThisDate = isodate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View
      style={{
        shadowColor: currentColors.placeholder,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: currentColors.placeholder,
        borderRadius: 15,
        width: "100%",
        height: 200,
        backgroundColor: currentColors.background,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
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
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: currentColors.text,
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
            {state === "pending" ? (
              <View
                style={{
                  backgroundColor: "#3366FF",
                  borderRadius: 16,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Comfortaa",
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#D2D2D2",
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Comfortaa",
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)}
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
            fontSize: 20,
            fontFamily: "Comfortaa-Bold",
            fontWeight: "700",
            color: "#666666",
            letterSpacing: 0.2,
            marginBottom: 5,
          }}
        >
          {formatThisDate}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <OrangeMarker
            width={20}
            height={20}
            style={{ marginRight: 8, width: 120 }}
          />
          <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
            {startLocation.split(" ").slice(0, 3).join(" ")}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: "#FF6A00",
              fontFamily: "Comfortaa",
            }}
          >
            Est: {startTime.toLowerCase()}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
            {endLocation.split(" ").slice(0, 3).join(" ")}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: "#E24949",
              fontFamily: "Comfortaa",
            }}
          >
            Est: {endTime.toLowerCase()}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <StackedProfilePictures images={images} />

          {recurrence === "one time" ? (
            <View
              style={{
                backgroundColor: "rgba(255, 136, 51, 0.1)",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RepeatIcon width={16} height={16} style={{ marginRight: 5 }} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Comfortaa",
                  fontWeight: "700",
                  color: "#FF6A00",
                }}
              >
                {recurrence
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#D2D2D2",
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ArrowUp width={16} height={16} style={{ marginRight: 5 }} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Comfortaa",
                  fontWeight: "700",
                  color: "#FFFFFF",
                }}
              >
                {recurrence
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ActiveRiderCard;
