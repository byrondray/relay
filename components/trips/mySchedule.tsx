import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { Text, View } from "react-native";
import ScheduleMainCard from "../cards/scheduleMainCard";

const MySchedule = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  const fakeData = [
    {
      id: "312300192",
      state: "Pending" as "Pending" | "Timeout",
      date: new Date("2024-12-01T10:00:00Z"),
      startLocation: "Location A",
      startTime: "10:00 AM",
      endLocation: "Location B",
      endTime: "12:00 PM",
      images: [require("@/assets/images/user/gloria/child/gloria-child.jpg")],
      recurrence: "recurring" as "one time" | "recurring",
    },
    {
      id: "987654321",
      state: "Timeout" as "Pending" | "Timeout",
      date: new Date("2024-11-28T15:00:00Z"),
      startLocation: "Location C",
      startTime: "3:00 PM",
      endLocation: "Location D",
      endTime: "5:00 PM",
      images: [
        require("@/assets/images/user/vanessa/child/vanessa-child.jpg"),
        require("@/assets/images/user/evan/child/evan-child.jpg"),
      ],
      recurrence: "one time" as "one time" | "recurring",
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "Comfortaa-Bold",
            color: currentColors.text,
          }}
        >
          My Schedule
        </Text>
        {/* <TouchableOpacity>
    <Text
      style={{
        fontFamily: "Comfortaa",
        fontSize: 12,
        textDecorationLine: "underline",
        color: "rgba(143, 156, 179, 1)",
      }}
    >
      Advanced Search
    </Text>
  </TouchableOpacity> */}
      </View>

      {fakeData.map((item) => (
        <View
          key={item.id}
          style={{
            paddingBottom: 20,
          }}
        >
          <ScheduleMainCard
            key={item.id}
            id={item.id}
            state={item.state}
            date={item.date}
            startLocation={item.startLocation}
            startTime={item.startTime}
            endLocation={item.endLocation}
            endTime={item.endTime}
            images={item.images}
            recurrence={item.recurrence}
            // driverDetails={item.driverDetails}
          />
        </View>
      ))}
    </View>
  );
};

export default MySchedule;
