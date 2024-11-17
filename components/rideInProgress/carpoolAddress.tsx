import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CarpoolWithRequests } from "@/graphql/generated";

const LocationCard = ({
  carpoolData,
}: {
  carpoolData: CarpoolWithRequests;
}) => {
  return (
    <View style={styles.card}>
      {/* Start Location */}
      <View style={styles.locationRow}>
        <View style={[styles.icon, { backgroundColor: "#FF6A00" }]} />
        <View>
          <Text style={styles.label}>Start Location</Text>
          <Text style={styles.address}>{carpoolData?.startAddress}</Text>
        </View>
      </View>

      {/* Destination */}
      <View style={styles.locationRow}>
        <View style={[styles.icon, { backgroundColor: "#E24949" }]} />
        <View>
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.address}>{carpoolData?.endAddress}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 4,
    fontFamily: "Comfortaa",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  address: {
    fontSize: 16,
    color: "#8F9BB3",
    fontFamily: "Comfortaa",
  },
});

export default LocationCard;
