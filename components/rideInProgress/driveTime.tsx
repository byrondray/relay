import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const TimeCard = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  const { currentColors } = useTheme()
  return (
    <View style={styles.card}>
      {/* Start Time Section */}
      <View style={styles.timeSection}>
        <Text style={[styles.timeLabel, {color: currentColors.text}]}>Start time (Estimated time)</Text>
        <Text style={[styles.timeValue, { color: currentColors.text }]}>
          {startTime}
          <Text style={[styles.timePeriod, {color: currentColors.text}]}>am</Text>
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* End Time Section */}
      <View style={styles.timeSection}>
        <Text style={[styles.timeLabel, {color: currentColors.text}]}>Arrival time (Estimated time)</Text>
        <Text style={[styles.timeValue, { color: "#E24949" }]}>
          {endTime}
          <Text style={styles.timePeriod}>am</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingBottom: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 10,
  },
  timeSection: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 8,
    // color: "#666666",
    fontFamily: "Comfortaa",
    marginBottom: 4,
    alignSelf: "flex-start"
  },
  timeValue: {
    fontSize: 36,
    fontFamily: "Comfortaa",
    fontWeight: "bold",
  },
  timePeriod: {
    fontSize: 40,
    fontFamily: "Comfortaa",
    fontWeight: "normal",
  },
  divider: {
    width: 1,
    height: "140%",
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
});

export default TimeCard;
