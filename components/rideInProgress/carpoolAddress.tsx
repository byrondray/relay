import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CarpoolWithRequests } from "@/graphql/generated";
import { useTheme } from "@/contexts/ThemeContext";

const LocationCard = ({
  carpoolData,
}: {
  carpoolData: CarpoolWithRequests;
}) => {
  const { currentColors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: currentColors.background }]}>
      {/* Start Location */}
      <View style={styles.locationRow}>
        <View
          style={[
            styles.icon,
            { backgroundColor: currentColors.tint }, // Dynamic color for the start location icon
          ]}
        />
        <View>
          <Text
            style={[
              styles.label,
              { color: currentColors.text }, // Dynamic label color
            ]}
          >
            Start Location
          </Text>
          <Text
            style={[
              styles.address,
              { color: currentColors.text }, // Dynamic address color
            ]}
          >
            {carpoolData?.startAddress}
          </Text>
        </View>
      </View>

      {/* Destination */}
      <View style={styles.locationRow}>
        <View
          style={[
            styles.icon,
            { backgroundColor: currentColors.tint }, // Dynamic color for the destination icon
          ]}
        />
        <View>
          <Text
            style={[
              styles.label,
              { color: currentColors.text }, // Dynamic label color
            ]}
          >
            Destination
          </Text>
          <Text
            style={[
              styles.address,
              { color: currentColors.text }, // Dynamic address color
            ]}
          >
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
    marginBottom: 4,
    fontFamily: "Comfortaa",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  address: {
    fontSize: 16,
    fontFamily: "Comfortaa",
  },
});

export default LocationCard;
