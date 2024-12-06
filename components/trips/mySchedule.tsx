import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import ScheduleMainCard from "../cards/scheduleMainCard";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import { LinearGradient } from "expo-linear-gradient";

const driverData1: User = {
  id: "1",
  firstName: "Gloria",
  lastName: "Chan",
  email: "gloria@gmail.com",
  imageUrl: require("@/assets/images/user/gloria/gloria-profile.jpg"),
};

const vehicle1: Vehicle = {
  id: "1",
  make: "Tesla",
  model: "Model 3",
  year: "2021",
  color: "black",
  licensePlate: "EDF32D4",
  seats: 5,
  userId: "1",
};

const carpoolData1: CarpoolWithRequests = {
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

const driverData2: User = {
  id: "2",
  firstName: "Kyanna ",
  lastName: "Krueger",
  email: "Kyanna@gmail.com",
  imageUrl: require("@/assets/images/user/kyanna/kyanna-profile.jpg"),
};

const vehicle2: Vehicle = {
  id: "2",
  make: "Toyota",
  model: "Corolla",
  year: "2020",
  color: "white",
  licensePlate: "XYZ5678",
  seats: 4,
  userId: "2",
};

const carpoolData2: CarpoolWithRequests = {
  id: "2",
  startAddress: "5678 Birch St",
  endAddress: "1234 Pine St",
  departureTime: "3:00 PM",
  departureDate: new Date("2024-12-05T15:00:00Z").toISOString(),
  endLat: 0,
  endLon: 0,
  groupId: "group2",
  startLat: 0,
  startLon: 0,
  driverId: "2",
  vehicleId: "2",
};

const MySchedule = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  const fakeData = [
    {
      id: "312300192",
      state: "Pending" as "Pending" | "Timeout",
      date: new Date("2024-12-01T10:00:00Z"),
      startLocation: "Edmonds Community ",
      startTime: "10:00 AM",
      endLocation: "Richmond Oval",
      endTime: "12:00 PM",
      images: [require("@/assets/images/user/gloria/child/gloria-child.jpg")],
      recurrence: "Recurring" as "One time" | "Recurring",
      driverDetails: {
        driverData: driverData1,
        vehicleData: vehicle1,
        carpoolData: carpoolData1,
      },
    },
    {
      id: "987654321",
      state: "Timeout" as "Pending" | "Timeout",
      date: new Date("2024-11-28T15:00:00Z"),
      startLocation: "Vancouver Community",
      startTime: "3:00 PM",
      endLocation: "Richmond Oval",
      endTime: "5:00 PM",
      images: [
        require("@/assets/images/user/vanessa/child/vanessa-child.jpg"),
        require("@/assets/images/user/evan/child/evan-child.jpg"),
      ],
      recurrence: "One time" as "One time" | "Recurring",
      driverDetails: {
        driverData: driverData2,
        vehicleData: vehicle2,
        carpoolData: carpoolData2,
      },
    },
  ];

  return (
    <View
      style={{
        width: "100%",
        marginTop: 0,
      }}
    >
      <LinearGradient
        colors={[currentColors.gradient[0], currentColors.gradient[1]]}
        style={[styles.gradientBackground, {}]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // Diagonal gradient
      >
      <Input
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        accessoryRight={() => <SearchIcon width={24} height={24} />}
        style={{
          flex: 1,
          marginTop: 20,
          backgroundColor: currentColors.placeholder,
          borderRadius: 24,
          fontFamily: "ComfortaaBold",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
        <Text style={styles.sectionTitle}>
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
            paddingBottom: 16,
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
            driverDetails={item.driverDetails}
          />
        </View>
      ))}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    flex: 1,
    width: "100%",
    marginBottom: 16,
    marginVertical: 16,
    marginLeft: 8,
    paddingHorizontal: 16,
    fontFamily: "ComfortaaBold",
    fontWeight: 600,  
    fontSize: 24,
    lineHeight: 26, 
    letterSpacing: -1,
  },
  gradientBackground: {
    paddingHorizontal: 16,
    flex: 1,
    height: "100%",
  },
});

export default MySchedule;
