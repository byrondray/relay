import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PlacementOptions } from "@ui-kitten/components/ui/popover/type";

interface TimeCardProps {
  startTime: string;
  endTime: string;
}

const TimeCard = ({ startTime, endTime }: TimeCardProps) => {
  const { currentColors } = useTheme();

  const splitStartTime = startTime.split(" ");
  const splitEndTime = endTime.split(" ");

  const startTimeValue = splitStartTime.slice(0, 2).join("");
  const startPeriod = splitStartTime[2];

  const endTimeValue = splitEndTime.slice(0, 2).join("");
  const endPeriod = splitEndTime[2];

  return (
    <View style={[styles.timeCardContainer, { shadowColor: currentColors.text, }]}>
      {/* Start time here */}
      <View style={[styles.startTimeContainer, { backgroundColor:  currentColors.background,}]}>
        <View style={[styles.startTimeContent, {}]}>
          <Text style={[styles.startTimeTitle, { color: currentColors.text, }]}>
            Start time (Estimated time)
          </Text>
          <View style={[styles.startTimeClock, {}]}>
            <Text style={[styles.startTimeValue, {}]}>
              {startTimeValue}
            </Text>
            <Text style={[styles.startTimePeriod, {}]}>
              {startPeriod}
            </Text>
          </View>
        </View>
      </View>
      {/* Separate Line here */}
      <View style={[styles.separateLine, {}]} />
      {/* Arrive time here */}
      <View style={[styles.arriveTimeContainer, { backgroundColor:  currentColors.background,}]}>
        <View style={[styles.arriveTimeContent, {}]}>
          <Text style={[styles.arriveTimeTitle, { color: currentColors.text, }]}>
            Arrival time (Estimated time)
          </Text>
          <View style={[styles.arriveTimeClock, {}]}>
            <Text style={[styles.arriveTimeValue, {}]}>
              {endTimeValue}
            </Text>
            <Text style={[styles.arriveTimePeriod, {}]}>
              {endPeriod}
            </Text>
          </View>
        </View>
      </View>
    </View>  
  );
};

const styles = StyleSheet.create({
  timeCardContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: "100%",
    marginVertical: 10,
  },
  startTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    width: "50%",
    height: 86,
  },
  startTimeContent: {
    width: "100%",
    padding: 10,
  },
  startTimeTitle: {
    textAlign: "center", 
    fontSize: 9,
    fontFamily: "ComfortaaBold",
  },
  startTimeClock: {
    flex: 1,
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    marginTop: 6,
  },
  startTimeValue: {
    marginRight: 6,
    fontSize: 38,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    lineHeight: 42,
    letterSpacing: -0.3,
    color: "#FB812A",
  },
  startTimePeriod: {
    fontSize: 14,
    lineHeight: 15,
    fontFamily: "ComfortaaBold",
    color: "#FB812A",
    marginBottom: 5,
  },
  separateLine: {
    width: 1,
    height: "100%",
    backgroundColor: "#f2f2f2",
  },
  arriveTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    width: "50%",
    height: 86,
  },
  arriveTimeContent: {
    width: "100%",
    padding: 10,
  },
  arriveTimeTitle: {
    textAlign: "center", 
    fontSize: 9,
    fontFamily: "ComfortaaBold",
  },
  arriveTimeClock: {
    flex: 1,
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    marginTop: 6,
  },
  arriveTimeValue: {
    marginRight: 6,
    fontSize: 38,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    lineHeight: 42,
    letterSpacing: -0.3,
    color: "#E24949",
  },
  arriveTimePeriod: {
    fontSize: 14,
    lineHeight: 15,
    fontFamily: "ComfortaaBold",
    color: "#E24949",
    marginBottom: 5,
  },
});

export default TimeCard;
