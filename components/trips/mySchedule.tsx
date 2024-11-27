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
      images: [
        "https://placekitten.com/200/200",
        "https://placekitten.com/201/201",
      ],
      recurrence: "recurring" as "one time" | "recurring",
      driverDetails: {
        driverData: {
          id: "user001",
          name: "John Doe",
          email: "john.doe@example.com",
          profilePicture: "https://via.placeholder.com/100.png?text=JD",
        },
        vehicleData: {
          id: "vehicle001",
          make: "Honda",
          model: "Civic",
          year: 2022,
          color: "Red",
        },
        carpoolData: {
          id: "carpool001",
          status: "active",
          requests: [
            { id: "req1", status: "approved" },
            { id: "req2", status: "pending" },
          ],
        },
      },
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
        "https://placekitten.com/202/202",
        "https://placekitten.com/203/203",
      ],
      recurrence: "one time" as "one time" | "recurring",
      driverDetails: {
        driverData: {
          id: "user002",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          profilePicture: "https://via.placeholder.com/100.png?text=JS",
        },
        vehicleData: {
          id: "vehicle002",
          make: "Toyota",
          model: "Corolla",
          year: 2020,
          color: "Blue",
        },
        carpoolData: {
          id: "carpool002",
          status: "completed",
          requests: [
            { id: "req3", status: "approved" },
            { id: "req4", status: "declined" },
          ],
        },
      },
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
