import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CarpoolWithRequests } from "@/graphql/generated";
import { useTheme } from "@/contexts/ThemeContext";
import OrangeMarker from "@/assets/images/OrangeMarker.svg"; // Icon for start location
import RedMarker from "@/assets/images/RedMarker.svg"; // Icon for destination

const LocationCard = ({
  carpoolData,
}: {
  carpoolData: CarpoolWithRequests;
}) => {
  const { currentColors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: currentColors.background }]}>
      {/* Start Location */}
      <Text style={[styles.label, { color: currentColors.text }]}>
        Start Location
      </Text>
      <View style={styles.locationRow}>
        <OrangeMarker width={20} height={20} style={styles.icon} />
        <View style={styles.locationText}>
          <Text style={[styles.address, { color: currentColors.text }]}>
            {carpoolData?.startAddress}
          </Text>
        </View>
      </View>

      {/* Destination */}
      <Text style={[styles.label, { color: currentColors.text }]}>
        Destination
      </Text>
      <View style={styles.locationRow}>
        <RedMarker width={20} height={20} style={styles.icon} />
        <View style={styles.locationText}>
          <Text style={[styles.address, { color: currentColors.text }]}>
            {carpoolData?.endAddress}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  locationText: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  label: {
    fontFamily: "Comfortaa",
    color: "black",
    fontSize: 14,
    marginBottom: 4,
    alignItems: "center",
  },
  address: {
    fontFamily: "Comfortaa",
    color: "black",
    fontSize: 16,
  },
});

export default LocationCard;
