import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { Text, View } from "react-native";
import DriverMainCard from "../cards/driverPostMainCard";

const DriverPost = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  const fakeCardData = {
    id: "12345678",
    state: "Pending",
    date: "2024-12-01",
    startLocation: "123 Main Street, Vancouver",
    startTime: "8:30 AM",
    endLocation: "456 Elm Street, Richmond",
    endTime: "9:45 AM",
    images: [
      require("@/assets/images/user/vanessa/child/vanessa-child.jpg"),
      require("@/assets/images/user/evan/child/evan-child.jpg"),
      require("@/assets/images/user/gloria/child/gloria-child.jpg"),
    ],
    recurrence: "recurring",
    driverDetails: {
      driverData: { name: "John Doe" },
      vehicleData: { make: "Toyota", model: "Camry", year: 2021 },
      carpoolData: { passengers: 3, maxPassengers: 4 },
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
          color: currentColors.text,
          marginTop: 20,
        }}
      >
        Driver Post
      </Text>

      <DriverMainCard
        id={fakeCardData.id}
        state={fakeCardData.state}
        date={fakeCardData.date}
        startLocation={fakeCardData.startLocation}
        startTime={fakeCardData.startTime}
        endLocation={fakeCardData.endLocation}
        endTime={fakeCardData.endTime}
        images={fakeCardData.images}
        recurrence={fakeCardData.recurrence}
        // driverDetails={fakeCardData.driverDetails}
      />
    </View>
  );
};

export default DriverPost;
