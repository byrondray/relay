import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface DriverInfoProps {
  driverImage: string;
  driverName: string;
  carPlate: string;
  vehicleModel: string;
}

const DriverInfo = ({
  driverImage,
  driverName,
  carPlate,
  vehicleModel,
}: DriverInfoProps) => {
    
  return (
    <View style={styles.container}>
      <Image source={{ uri: driverImage }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>Driver</Text>
        <Text style={styles.value}>{driverName}</Text>

        <Text style={styles.label}>Car Plate</Text>
        <Text style={styles.value}>{carPlate}</Text>

        <Text style={styles.label}>Vehicle Model</Text>
        <Text style={styles.value}>{vehicleModel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
});

export default DriverInfo;
