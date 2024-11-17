import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { RequestWithParentAndChild } from "@/graphql/generated";
import TimeCard from "./driveTime";

const RequestCard = ({
  request,
  index,
  isCurrentUser,
}: {
  request: RequestWithParentAndChild;
  index: number;
  isCurrentUser: boolean;
}) => {
  let code;
  if (isCurrentUser) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
    code = randomNumber.split("");
  }
  console.log(request);
  return (
    <View style={[styles.card, isCurrentUser && styles.currentUserCard]}>
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
            <Text style={styles.passengerLabel}>Passenger {index + 1}</Text>
            <Text style={styles.passengerName}>
              {request.parent.firstName} {request.parent.lastName}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: 110,
            backgroundColor: "#3366FF",
            marginRight: 10,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
            paddingVertical: 7,
          }}
        >
          <Image source={require("@/assets/images/processing-icon.png")} />
          <Text style={{ color: "#fff", marginLeft: 7 }}>Waiting</Text>
        </View>
      </View>

      {/* Security Code for Current User */}
      {isCurrentUser && code && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Your security matching code</Text>
          <View style={styles.codeRow}>
            {code.map((digit, idx) => (
              <View key={idx} style={styles.codeCircle}>
                <Text style={styles.codeText}>{digit}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Pickup Location Section */}
      <View style={styles.pickupSection}>
        <Text style={styles.pickUpLocation}>
          Pick up Location - Point {index + 1}
        </Text>
        <View style={{ marginTop: 5, flexDirection: "row", marginBottom: -10 }}>
          <View
            style={[
              styles.icon,
              { backgroundColor: "#FF6A00", marginRight: 5 },
            ]}
          />
          <Text style={[styles.location, { flexShrink: 1 }]}>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  currentUserCard: {
    backgroundColor: "rgba(251, 104, 86, 0.1)",
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
    color: "#888",
    fontFamily: "Comfortaa",
  },
  passengerName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Comfortaa",
  },
  statusBadge: {
    backgroundColor: "#3366FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Comfortaa",
  },
  codeContainer: {
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontFamily: "Comfortaa",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  codeCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#FF6A00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Comfortaa",
  },
  pickupSection: {
    marginBottom: 16,
  },
  pickUpLocation: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    fontFamily: "Comfortaa",
  },
  location: {
    fontSize: 15,
    color: "#8F9BB3",
    fontFamily: "Comfortaa",
  },
  distanceDuration: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    fontFamily: "Comfortaa",
  },
});

export default RequestCard;
