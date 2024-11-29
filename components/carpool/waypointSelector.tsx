import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { RequestWithChildrenAndParent, Vehicle } from "@/graphql/generated";
import { IndexPath } from "@ui-kitten/components";

const WaypointSelector = ({
  requests,
  seatsAvailable,
  selectedWaypoints,
  setSelectedWaypoints,
  vehicles,
  selectedVehicleIndex,
  selectedChildren,
}: {
  requests: RequestWithChildrenAndParent[];
  seatsAvailable: number;
  selectedWaypoints: RequestWithChildrenAndParent[];
  setSelectedWaypoints: (
    selectedRequests: RequestWithChildrenAndParent[]
  ) => void;
  vehicles: Vehicle[];
  selectedVehicleIndex: IndexPath;
  selectedChildren: string[];
}) => {
  const [selectedWaypointIds, setSelectedWaypointIds] = useState<string[]>([]);

  useEffect(() => {
    const initialSelectedIds = selectedWaypoints.map((request) => request.id);
    setSelectedWaypointIds(initialSelectedIds);
  }, [selectedWaypoints]);

  const toggleSelection = (request: RequestWithChildrenAndParent) => {
    const requestId = request.id;
    const seatsTaken = request.children.length;

    if (selectedWaypointIds.includes(requestId)) {
      const updatedWaypoints = selectedWaypointIds.filter(
        (id) => id !== requestId
      );
      setSelectedWaypointIds(updatedWaypoints);
      setSelectedWaypoints(
        requests.filter((req) => updatedWaypoints.includes(req.id))
      );
    } else {
      const currentSeatsTaken = selectedWaypointIds.reduce((acc, id) => {
        const req = requests.find((r) => r.id === id);
        return acc + (req ? req.children.length : 0);
      }, 0);

      const vehicleSeats = vehicles[selectedVehicleIndex.row]?.seats || 0;
      const seatsLeft =
        vehicleSeats - selectedChildren.length - currentSeatsTaken;

      if (seatsTaken <= seatsLeft) {
        const updatedWaypoints = [...selectedWaypointIds, requestId];
        setSelectedWaypointIds(updatedWaypoints);
        setSelectedWaypoints(
          requests.filter((req) => updatedWaypoints.includes(req.id))
        );
      } else {
        console.log("Selection denied: Not enough seats available.");
      }
    }
  };

  const renderRequestItem = (
    request: RequestWithChildrenAndParent,
    index: number
  ) => {
    const parentName = request.children[0]?.firstName || "Unknown Parent";
    const initials = parentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const profileImageUrl = request.children[0].parent.imageUrl;
    const childImageUrl = request.children[0]?.imageUrl;

    const seatRequestCount = request.children.length;
    const isSelected = selectedWaypointIds.includes(request.id);

    return (
      <TouchableOpacity
        style={styles.requestContainer}
        onPress={() => toggleSelection(request)}
      >
        <View style={styles.badgeContainerRight}>
          {isSelected ? (
            <Image
              source={require("../../assets/images/checkmark-circle-icon.png")}
              style={styles.checkmarkIcon}
            />
          ) : (
            <Text style={[styles.badgeText, { fontFamily: "Comfortaa" }]}>
              {index + 1}
            </Text>
          )}
        </View>

        <View style={styles.imageWrapper}>
          {profileImageUrl ? (
            <Image
              source={{
                uri: profileImageUrl || undefined,
              }}
              style={[styles.parentImage]}
            />
          ) : (
            <View
              style={[
                styles.parentImage,
                {
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#FF6A00",
                },
              ]}
            >
              <Text style={[styles.initialsText, { fontFamily: "Comfortaa" }]}>
                {initials}
              </Text>
            </View>
          )}

          {childImageUrl && (
            <Image
              source={{
                uri: childImageUrl,
              }}
              style={styles.childImage}
            />
          )}
        </View>

        <Text
          style={[
            styles.seatRequestText,
            { fontFamily: "Comfortaa", marginTop: 4 },
          ]}
        >
          {seatRequestCount} seat request{seatRequestCount > 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderRequestItem(item, index)}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default WaypointSelector;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listContainer: {
    flexDirection: "row",
  },
  requestContainer: {
    alignItems: "center",
    marginRight: 20,
    position: "relative",
    marginTop: 10,
  },
  badgeContainerRight: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  initialsCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    position: "relative",
  },
  initialsText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
  seatRequestText: {
    fontSize: 14,
    color: "#000",
  },
  checkmarkIcon: {
    width: 30,
    height: 30,
    color: "#fff",
  },
  imageWrapper: {
    position: "relative",
  },
  parentImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  childImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: -10,
    borderWidth: 1,
    borderColor: "#fff",
  },
});
