import ArrowUp from "@/assets/images/arrow-up.svg";
import Clock from "@/assets/images/clock.svg";
import OrangeMarker from "@/assets/images/OrangeMarker.svg";
import RedMarker from "@/assets/images/RedMarker.svg";
import RepeatIcon from "@/assets/images/repeat.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DriverInfo from "./driverCard";
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
  driverDetails: {
    driverData: User;
    vehicleData: Vehicle;
    carpoolData: CarpoolWithRequests;
  };
}

const vehicle: Vehicle = {
  id: "1",
  make: "Tesla",
  model: "Model 3",
  year: "2021",
  color: "black",
  licensePlate: "ABC-123",
  seats: 5,
  userId: "1",
};

const driverImage =
  "https://assets.crowdstrike.com/is/image/crowdstrikeinc/kevin-boehm3?ts=1726842946671&dpr=off";

const driverData: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@gmail.com",
  imageUrl: driverImage,
};

const carpoolData: CarpoolWithRequests = {
  id: "1",
  startAddress: "1234 Elm St",
  endAddress: "5678 Oak St",
  departureTime: "12:00 PM",
  departureDate: new Date().toISOString(),
  endLat: 0,
  endLon: 0,
  groupId: "group1",
  startLat: 0,
  startLon: 0,
  driverId: "1",
  vehicleId: "1",
};

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
  driverDetails,
}: CardData) => {
  const isodate = new Date(date); // delete this later when db is connected cause I forget.

  const formatThisDate = isodate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const textColor = useThemeColor({}, "placeholder");
  const { currentColors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: currentColors.background,
        borderRadius: 12,
        shadowColor: currentColors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        paddingHorizontal: 20,
        width: "100%",
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
                <Text
                  style={{
                    color: "#FF6A00",
                    fontFamily: "Comfortaa",
                    fontWeight: "700", // Make text bold
                    fontSize: 14, // Slightly larger font
                  }}
                >
                  {recurrence}
                </Text>
              </>
            ) : (
              <>
                <ArrowUp
                  width={16}
                  height={16}
                  style={{ marginHorizontal: 10 }}
                />
                <Text
                  style={{
                    color: "#FF6A00",
                    fontFamily: "Comfortaa",
                    fontWeight: "700",
                    fontSize: 14,
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
              backgroundColor: "#FFBB00",
              borderRadius: 16,
              paddingHorizontal: 12, // Increased padding for better spacing
              paddingVertical: 8, // Adjusted height for better usability
              borderWidth: 0,
              marginTop: 10,
              shadowColor: "#000", // Added shadow for a lifted appearance
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Clock
              width={16}
              height={16}
              style={{ marginLeft: 5, marginRight: 5 }}
            />
            <Text
              style={{
                color: "#001323",
                fontFamily: "Comfortaa",
                fontWeight: "600",
                fontSize: 14, // Slightly larger font
              }}
            >
              Confirmed
            </Text>
          </View>
        </View>

        <DriverInfo
          driverData={driverData}
          vehicleData={vehicle}
          carpoolData={carpoolData}
        />
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
