import React from "react";
import { View, Text } from "react-native";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { useTheme } from "@/contexts/ThemeContext";

const VehicleDetailsPicker = ({
  selectedVehicleIndex,
  selectedSeatsIndex,
  vehicles,
  seatsAvailable,
  setSelectedVehicleIndex,
  setSelectedSeatsIndex,
  textColor,
}: {
  selectedVehicleIndex: IndexPath;
  selectedSeatsIndex: IndexPath;
  vehicles: { make: string; model: string }[];
  seatsAvailable: number[];
  setSelectedVehicleIndex: (index: IndexPath) => void;
  setSelectedSeatsIndex: (index: IndexPath) => void;
  textColor: string;
}) => {
  const { currentColors } = useTheme();
  return (
    <View>
      <Text
        style={{
          color: currentColors.tint,
          fontSize: 22,
          marginBottom: 15,
          marginTop: 15,
          fontFamily: "Comfortaa-Regular",
        }}
      >
        Vehicle Details
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            color: textColor,
            marginTop: 15,
            marginBottom: 5,
            fontFamily: "Comfortaa-Regular",
          }}
        >
          Select Vehicle
        </Text>
        <Text
          style={{
            color: textColor,
            marginTop: 15,
            marginBottom: 5,
            fontFamily: "Comfortaa-Regular",
          }}
        >
          * Required
        </Text>
      </View>
      <View>
        <Select
          selectedIndex={selectedVehicleIndex}
          onSelect={(index: IndexPath | IndexPath[]) => {
            if (index instanceof IndexPath) {
              setSelectedVehicleIndex(index);
            }
          }}
          value={vehicles[selectedVehicleIndex?.row]?.make || "Select Vehicle"}
          placeholder="Select Vehicle"
        >
          {vehicles.map((vehicle, index) => (
            <SelectItem
              title={`${vehicle.make} ${vehicle.model}`}
              key={index}
            />
          ))}
        </Select>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: textColor,
              marginTop: 15,
              marginBottom: 5,
              fontFamily: "Comfortaa",
            }}
          >
            Seats Available
          </Text>
          <Text
            style={{
              color: textColor,
              marginTop: 15,
              marginBottom: 5,
              fontFamily: "Comfortaa-Regular",
            }}
          >
            * Required
          </Text>
        </View>

        <Select
          selectedIndex={selectedSeatsIndex}
          onSelect={(index: IndexPath | IndexPath[]) => {
            if (index instanceof IndexPath) {
              setSelectedSeatsIndex(index);
            }
          }}
          value={
            seatsAvailable[selectedSeatsIndex?.row] !== undefined
              ? `${seatsAvailable[selectedSeatsIndex.row]}`
              : "Select Seats Available"
          }
          placeholder="Select Seats Available"
        >
          {seatsAvailable.map((seat, index) => (
            <SelectItem title={`${seat}`} key={index} />
          ))}
        </Select>
      </View>
    </View>
  );
};

export default VehicleDetailsPicker;
