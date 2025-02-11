import ArrowUp from "@/assets/images/arrow-up.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import RepeatIcon from "@/assets/images/repeat.svg";
import Trash from "@/assets/images/trach_icon.svg";
import Clock from "@/assets/images/whiteClock.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DriverInfo from "./driverCard";
import StackedProfilePictures from "./stackedProfile";

interface CardData {
  id: string;
  state: string;
  date: string;
  startLocation: string;
  startTime: string;
  endLocation: string;
  endTime: string;
  images: string[];
  recurrence: string;
  driverDetails: {
    driverData: User;
    vehicleData: Vehicle;
    carpoolData: CarpoolWithRequests;
  };
}

const DriverMainCard = ({
  id,
  state,
  date,
  startLocation,
  startTime,
  endLocation,
  endTime,
  images,
  recurrence,
  driverDetails,
}: CardData) => {
  const { currentColors } = useTheme();

  const isodate = new Date(date);

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
            RN: {id.slice(0, 8)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {recurrence === "recurring" ? (
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
                <RepeatIcon
                  width={16}
                  height={16}
                  style={{ marginHorizontal: 5 }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Comfortaa",
                    fontWeight: "700",
                    color: "#FF6A00",
                  }}
                >
                  {recurrence}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(255, 136, 51, 0.1)",
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ArrowUp
                  width={16}
                  height={16}
                  style={{ marginHorizontal: 5 }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Comfortaa",
                    fontWeight: "700",
                    color: "#FF6A00",
                  }}
                >
                  {recurrence}
                </Text>
              </View>
            )}
            <View
              style={{
                backgroundColor: "#3366FF",
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 6,
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Clock width={16} height={16} style={{ marginHorizontal: 5 }} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Comfortaa",
                  fontWeight: "700",
                  color: "#FFFFFF",
                }}
              >
                Pending
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 5,
              }}
            >
              <Trash width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
        {driverDetails && (
          <DriverInfo
            driverData={driverDetails.driverData}
            vehicleData={driverDetails.vehicleData}
            carpoolData={driverDetails.carpoolData}
          />
        )}
        <View
          style={{
            width: "100%",
            borderBottomWidth: 0.5,
            borderBottomColor: "#8F9BB3",
            alignSelf: "center",
            marginBottom: 10,
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
          <OrangeMarker width={20} height={20} style={{ marginRight: 8 }} />
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#FB812A",
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Comfortaa",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  marginHorizontal: 10,
                }}
              >
                Read Invitation
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DriverMainCard;
