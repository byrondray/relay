import SearchIcon from "@/assets/images/search.svg";
import ActiveRiderCard from "@/components/cards/activeCard";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@ui-kitten/components";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const fakeRequests = [
  {
    id: "1",
    startAddress: "123 Main St",
    pickupTime: "10:30 AM",
    endAddress: "456 Elm St",
    recurrence: "one time" as "one time",
    state: "pending" as "pending",
    images: [require("@/assets/images/user/vanessa/child/vanessa-child.jpg")],
  },
  {
    id: "2",
    startAddress: "789 Oak St",
    pickupTime: "2:00 PM",
    endAddress: "321 Pine St",
    recurrence: "recurring" as "recurring",
    state: "timeout" as "timeout",
    images: [require("@/assets/images/user/evan/child/evan-child.jpg")],
  },
  {
    id: "3",
    startAddress: "555 Maple Ave",
    pickupTime: "6:15 PM",
    endAddress: "999 Birch Rd",
    recurrence: "one time",
    state: "pending",
    images: [require("@/assets/images/user/gloria/child/gloria-child.jpg")],
  },
];

const RideRequest = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  const filteredRequests = fakeRequests.filter(
    (request) =>
      request.startAddress.toLowerCase().includes(searchText.toLowerCase()) ||
      request.endAddress.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ width: "100%", paddingHorizontal: 16, marginTop: -5 }}>
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
            color: currentColors.text,
          }}
        >
          Ride Requests
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
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <ActiveRiderCard
              id={item.id}
              state={item.state as "pending" | "timeout"}
              date={new Date()}
              startLocation={item.startAddress}
              startTime={item.pickupTime}
              endLocation={item.endAddress}
              endTime={item.pickupTime}
              images={item.images}
              recurrence={item.recurrence as "one time" | "recurring"}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: currentColors.text, textAlign: "center" }}>
            No requests found.
          </Text>
        }
        contentContainerStyle={styles.requestList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  requestList: {
    paddingBottom: 16,
  },
});

export default RideRequest;
