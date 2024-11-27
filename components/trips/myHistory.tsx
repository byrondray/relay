import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import DriverHistoryCard from "../cards/historyCard";

const MyHistory = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();
  const fakeDriverHistoryData = [
    {
      id: "abc12345",
      date: new Date(),
      startLocation: "123 Main Street, Vancouver, BC",
      startTime: "08:30 AM",
      endLocation: "456 Elm Street, Richmond, BC",
      endTime: "09:15 AM",
      images: [require("@/assets/images/user/gloria/child/gloria-child.jpg")],
      recurrence: "recurring",
      driverData: {
        name: "John Doe",
        imageUrl: "https://placekitten.com/200/200",
      },
    },
    {
      id: "def67890",
      date: new Date(),
      startLocation: "789 Maple Avenue, Burnaby, BC",
      startTime: "10:00 AM",
      endLocation: "123 Pine Road, Surrey, BC",
      endTime: "10:45 AM",
      images: [
        require("@/assets/images/user/vanessa/child/vanessa-child.jpg"),
        require("@/assets/images/user/evan/child/evan-child.jpg"),
      ],
      recurrence: "one time",
      driverData: {
        name: "Jane Smith",
        imageUrl: "https://placekitten.com/201/201",
      },
    },
  ];

  return (
    <ScrollView
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
        My History
      </Text>

      {fakeDriverHistoryData
        .filter((item) =>
          item.startLocation.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((data) => (
          <View
            style={{
              paddingBottom: 20,
            }}
          >
            <DriverHistoryCard key={data.id} {...data} />
          </View>
        ))}
    </ScrollView>
  );
};

export default MyHistory;
