import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { RequestWithParentAndChild } from "@/graphql/generated";
import TimeCard from "./driveTime";
import { useTheme } from "@/contexts/ThemeContext";

const RequestCard = ({
  request,
  index,
  isCurrentUser,
}: {
  request: RequestWithParentAndChild;
  index: number;
  isCurrentUser: boolean;
}) => {
  const { currentColors } = useTheme();
  let code;
  if (isCurrentUser) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
    code = randomNumber.split("");
  }
  return (
    <View
      style={[
        styles.card,
        isCurrentUser && { backgroundColor: currentColors.background, borderColor: currentColors.tint },
      ]}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {request.parent.imageUrl && (
            <Image
              source={{ uri: request.parent.imageUrl }}
              style={styles.passengerImage}
            />
          )}
          <View>
            <Text style={[styles.passengerLabel, {color: currentColors.placeholder}]}>Passenger {index + 1}</Text>
            <Text style={[styles.passengerName, {color: currentColors.text}]}>
              {request.parent.firstName} {request.parent.lastName}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: currentColors.background },
          ]}
        >
          <Image source={require("@/assets/images/processing-icon.png")} />
          <Text style={[styles.statusText, { color: currentColors.text }]}>
            Waiting
          </Text>
        </View>
      </View>

      {/* Security Code for Current User */}
      {isCurrentUser && code && (
        <View style={styles.codeContainer}>
          <Text style={[styles.codeLabel, {color: currentColors.placeholder}]}>Your security matching code</Text>
          <View style={styles.codeRow}>
            {code.map((digit, idx) => (
              <View
                key={idx}
                style={[
                  styles.codeCircle,
                  { backgroundColor: currentColors.tint },
                ]}
              >
                <Text style={[styles.codeText, {color: currentColors.text}]}>{digit}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Pickup Location Section */}
      <View style={styles.pickupSection}>
        <Text style={[styles.pickUpLocation, {color: currentColors.placeholder}]}>
          Pick up Location - Point {index + 1}
        </Text>
        <View style={{ marginTop: 5, flexDirection: "row", marginBottom: -10 }}>
          <View
            style={[
              styles.icon,
              {
                backgroundColor: currentColors.tint,
                marginRight: 5,
              },
            ]}
          />
          <Text style={[styles.location, { flexShrink: 1 }, {color: currentColors.placeholder}]}>
            {request.startAddress}
          </Text>
        </View>
      </View>

      {/* Time Section */}
      <TimeCard startTime={`8:45`} endTime={`9:32`} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  passengerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  passengerLabel: {
    fontSize: 14,
    fontFamily: "Comfortaa",
  },
  passengerName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Comfortaa",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Comfortaa",
    marginLeft: 7,
  },
  codeContainer: {
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "Comfortaa",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  codeCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    fontFamily: "Comfortaa",
  },
  pickupSection: {
    marginBottom: 16,
  },
  pickUpLocation: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Comfortaa",
  },
  location: {
    fontSize: 15,
    fontFamily: "Comfortaa",
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

export default RequestCard;
