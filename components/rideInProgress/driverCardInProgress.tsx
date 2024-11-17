import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import { auth } from "@/firebaseConfig";

const DriverCardInProgress = ({
  driverData,
  vehicleData,
  carpoolData,
}: {
  driverData: User;
  vehicleData: Vehicle;
  carpoolData: CarpoolWithRequests;
}) => {
  return (
    <View style={styles.card}>
      {/* Driver Image */}
      <View style={styles.profileContainer}>
        {driverData?.imageUrl && (
          <Image
            source={{ uri: driverData.imageUrl }}
            style={styles.driverImage}
          />
        )}
        <Text style={styles.likesText}>❤️ 300 likes</Text>
      </View>

      <View style={styles.infoContainer}>
        {/* Driver Info */}
        <View>
          <Text style={styles.driverLabel}>Driver</Text>
          <Text style={[styles.driverName, { marginTop: 5 }]}>
            {driverData?.firstName[0].toUpperCase()}
            {driverData?.firstName.slice(1)} {driverData?.lastName}
          </Text>
          <Text style={[styles.driverDetails, { marginTop: 5 }]}>
            Car Plate
          </Text>
          <Text style={[styles.driverName, { marginTop: 5 }]}>
            {vehicleData?.licensePlate}
          </Text>
          <Text style={[styles.driverDetails, { marginTop: 5 }]}>
            Vehicle Model
          </Text>
          <Text style={[styles.driverName, { marginTop: 5 }]}>
            {vehicleData?.model}
          </Text>
        </View>

        {/* Likes */}
      </View>

      {/* Message Icon */}
      {driverData?.id !== auth.currentUser?.uid && (
        <View style={styles.messageIconContainer}>
          <Image
            source={require("@/assets/images/message-circle.png")} // Replace with the correct path
            style={styles.messageIcon}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    marginTop: -50,
  },
  infoContainer: {
    flex: 1,
  },
  driverLabel: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Comfortaa",
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
    fontFamily: "Comfortaa",
  },
  driverDetails: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Comfortaa",
  },
  likesText: {
    fontSize: 14,
    color: "#E74C3C",
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Comfortaa",
  },
  messageIconContainer: {
    backgroundColor: "#FF8C00",
    borderRadius: 25,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100,
  },
  messageIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  profileContainer: {
    flexDirection: "column",
    alignItems: "center", // Center profile picture and likes
    justifyContent: "center", // Center vertically
    marginRight: 22,
  },
});

export default DriverCardInProgress;
