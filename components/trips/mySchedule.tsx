import React, { useState } from "react";
import { View, TextInput, Text, ScrollView, Dimensions } from "react-native";
import { Input } from "@ui-kitten/components";
import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import ScheduleActiveCard from "../cards/scheduleCard";

const MySchedule = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  const fakeData = [
    {
      id: "12345678-001",
      state: "pending",
      date: new Date(),
      startLocation: "Location A",
      startTime: "10:00 AM",
      endLocation: "Location B",
      endTime: "12:00 PM",
      images: [
        "https://placekitten.com/200/200",
        "https://placekitten.com/201/201",
      ],
      recurrence: "recurring",
    },
  ];

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
          marginTop: 60,
        }}
      >
        My Schedule
      </Text>

      {fakeData.map((item) => (
        <View
          key={item.id}
          style={{
            marginRight: 16,
          }}
        >
          <ScheduleActiveCard
            id={item.id}
            state={item.state}
            date={item.date}
            startLocation={item.startLocation}
            startTime={item.startTime}
            endLocation={item.endLocation}
            endTime={item.endTime}
            images={item.images}
            recurrence={item.recurrence}
          />
        </View>
      ))}
    </View>
  );
};

export default MySchedule;
