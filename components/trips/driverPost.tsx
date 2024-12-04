import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { Text, View } from "react-native";
import DriverMainCard from "../cards/driverPostMainCard";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";

const driverDataVanessa: User = {
  id: "3",
  firstName: "Vanessa",
  lastName: "Nguyen",
  email: "vanessa.nguyen@gmail.com",
  imageUrl: require("@/assets/images/user/vanessa/Vanessa.jpg"),
};

const vehicleVanessa: Vehicle = {
  id: "3",
  make: "Honda",
  model: "Civic",
  year: "2019",
  color: "blue",
  licensePlate: "ABC1234",
  seats: 4,
  userId: "3",
};

const carpoolDataVanessa: CarpoolWithRequests = {
  id: "3",
  startAddress: "789 Maple St",
  endAddress: "345 Cedar Ave",
  departureTime: "8:30 AM",
  departureDate: new Date("2024-12-02T08:30:00Z").toISOString(),
  endLat: 49.283,
  endLon: -123.121,
  groupId: "group3",
  startLat: 49.276,
  startLon: -123.114,
  driverId: "3",
  vehicleId: "3",
};

const DriverPost = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  const fakeCardData = {
    id: "123456789",
    state: "Pending" as "Pending" | "Timeout",
    date: new Date("2024-12-02T08:30:00Z"),
    startLocation: "Maple Grove Park",
    startTime: "8:30 AM",
    endLocation: "Downtown Library",
    endTime: "9:00 AM",
    images: [require("@/assets/images/user/vanessa/child/vanessa-child.jpg")],
    recurrence: "One time" as "One time" | "Recurring",
    driverDetails: {
      driverData: driverDataVanessa,
      vehicleData: vehicleVanessa,
      carpoolData: carpoolDataVanessa,
    },
  };

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 16,
        marginTop: -5,
      }}
    >
      <Input
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        accessoryRight={() => <SearchIcon width={24} height={24} />}
        style={{
          flex: 1,
          backgroundColor: currentColors.placeholder,
          borderRadius: 24,
          fontFamily: "Comfortaa",
        }}
      />
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 20,
          fontFamily: "Comfortaa-bold",
          color: currentColors.text,
          marginTop: 20,
        }}
      >
        Driver Post
      </Text>

      <DriverMainCard
        id={fakeCardData.id}
        state={fakeCardData.state}
        date={fakeCardData.date.toISOString()}
        startLocation={fakeCardData.startLocation}
        startTime={fakeCardData.startTime}
        endLocation={fakeCardData.endLocation}
        endTime={fakeCardData.endTime}
        images={fakeCardData.images}
        recurrence={fakeCardData.recurrence}
        driverDetails={fakeCardData.driverDetails}
      />
    </View>
  );
};

export default DriverPost;
