import ArrowUp from "@/assets/images/arrow-up.svg";
import HeartIcon from "@/assets/images/heart.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import RepeatIcon from "@/assets/images/repeat.svg";
import TimeIcon from "@/assets/images/timeIcon.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { User } from "@/graphql/generated";
import React from "react";
import { Image, Text, View } from "react-native";
import StackedProfilePictures from "./stackedProfile";

interface CardData {
  id: string;
  date: Date;
  startLocation: string;
  startTime: string;
  endLocation: string;
  endTime: string;
  images: string[];
  recurrence: "One time" | "Recurring";
  driverData: User;
}

const DriverHistoryCard = ({
  driverData,
  id,
  date,
  startLocation,
  startTime,
  endLocation,
  endTime,
  images,
  recurrence,
}: CardData) => {
  const { currentColors } = useTheme();

  const isodate = new Date(date);

  const formatThisDate = isodate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const randomLikes = Math.floor(Math.random() * (750 - 50 + 1)) + 50;

  const getImageSource = (image: string | number) => {
    if (typeof image === "string") {
      return { uri: image };
    }
    return image;
  };

  return (
    <View
      style={{
        shadowColor: currentColors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: currentColors.placeholder,
        borderRadius: 15,
        width: "100%",
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
            <View
              style={{
                backgroundColor: "#FF5F52",
                borderRadius: 16,
                paddingHorizontal: 18,
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
                Finished
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View style={{ marginRight: 16 }}>
            {driverData?.imageUrl && (
              <Image
                source={getImageSource(driverData.imageUrl)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                }}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#8F9BB3",
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
                color: currentColors.text,
                fontFamily: "Comfortaa-Bold",
              }}
            >
              {driverData?.firstName}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        </View>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 0.5,
            borderBottomColor: "#8F9BB3",
            alignSelf: "center",
            marginVertical: 10,
          }}
        />
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

          {recurrence === "One time" ? (
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
          )}
        </View>
      </View>
    </View>
  );
};

export default DriverHistoryCard;
