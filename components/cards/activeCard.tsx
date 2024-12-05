import ArrowUp from "@/assets/images/arrow-up.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import RepeatIcon from "@/assets/images/repeat.svg";
import TimeIcon from "@/assets/images/timeIcon.svg";
import Trash from "@/assets/images/trach_icon.svg";
import { useTheme } from "@/contexts/ThemeContext"; // Importing useTheme
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import StackedProfilePictures from "./stackedProfile";

interface CardData {
  id: string;
  state: "confirmed" | "timeout";
  date: Date;
  startLocation: string;
  startTime: string; // Either "3:30 PM" or ISO string "2024-11-26T22:25:00.000Z"
  endLocation: string;
  endTime: string; // Either "3:30 PM" or ISO string
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
  const { currentColors } = useTheme();

  // Helper to parse and format time
  const formatTime = (time: string) => {
    // Check if the time is already formatted (e.g., "3:30 PM")
    if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) {
      return time; // Return as is
    }
    // Parse ISO string and format to "3:30 PM"
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isodate = new Date(date); // Placeholder for date formatting
  const formatThisDate = isodate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View
      style={{
        shadowColor: currentColors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 0,
        borderColor: currentColors.placeholder,
        borderRadius: 15,
        width: "100%",
        backgroundColor: currentColors.background,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: "ComfortaaBold",
              fontWeight: "600",
              color: currentColors.text,
            }}
          >
            RN: {id.slice(0, 8).toUpperCase()}
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
                    fontFamily: "ComfortaaMedium",
                    fontWeight: "600",
                    color: "#FFFFFF",
                  }}
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#3366FF",
                  borderRadius: 16,
                  paddingHorizontal: 10,
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
            )}
            <TouchableOpacity
              onPress={() => { }}
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
            fontSize: 24,
            fontFamily: "ComfortaaBold",
            fontWeight: "600",
            color: "#666666",
            letterSpacing: -0.8,
            marginBottom: 15,
          }}
        >
          {formatThisDate}
        </Text>

        {/* Start Location */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <OrangeMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
            {startLocation.split(" ").slice(0, 3).join(" ").replace(",", "")}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: "#FF6A00",
              fontFamily: "ComfortaaRegular",
            }}
          >
            Est: {formatTime(startTime)}
          </Text>
        </View>

        {/* End Location */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, }}>
          <RedMarker width={20} height={20} style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
            {endLocation.split(" ").slice(0, 3).join(" ").replace(",", "")}
          </Text>
          <Text
            style={{
              marginLeft: "auto",
              color: "#E24949",
              fontFamily: "ComfortaaRegular",
            }}
          >
            Est: {formatTime(endTime)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 10 }}>
          <Text style={{
            fontFamily: "Comfortaa",
            color: currentColors.text,
            fontSize: 10,
          }}>Passengers</Text>
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
                  fontSize: 12,
                  fontFamily: "ComfortaaRegular",
                  fontWeight: "600",
                  letterSpacing: -0.3,
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
                backgroundColor: "rgba(255, 136, 51, 0.1)",
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
                  fontFamily: "ComfortaaBold",
                  fontWeight: "600",
                  color: "#FF6A00",
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
