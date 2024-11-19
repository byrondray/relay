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
          fontFamily: "Comfortaa",
        }}
      >
        Vehicle Details
      </Text>
      <Text
        style={{ color: currentColors.text, marginBottom: 5, fontFamily: "Comfortaa" }}
      >
        Select Vehicle
      </Text>
      <View>
        <View
          style={{
            backgroundColor: currentColors.placeholder,
            height: 43,
            borderColor: currentColors.placeholder,
            borderWidth: 1,
            borderRadius: 15,
            paddingLeft: 15,
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Select
            selectedIndex={selectedVehicleIndex}
            onSelect={(index: IndexPath | IndexPath[]) => {
              if (index instanceof IndexPath) {
                setSelectedVehicleIndex(index);
              }
            }}
            value={
              vehicles[selectedVehicleIndex?.row]?.make || "Select Vehicle"
            }
            placeholder="Select Vehicle"
            style={{
              backgroundColor: currentColors.background,
              borderColor: currentColors.placeholder,  
              borderWidth: 1,
              borderRadius: 8,            
            }}
          >
            {vehicles.map((vehicle, index) => (
              <SelectItem
                title={`${vehicle.make} ${vehicle.model}`}
                key={index}
              />
            ))}
          </Select>
        </View>

        <Text
          style={{ color: currentColors.text, marginBottom: 5, fontFamily: "Comfortaa" }}
        >
          Seats Available
        </Text>
        <View
          style={{
            backgroundColor: currentColors.placeholder,
            height: 43,
            borderColor: currentColors.placeholder,
            borderWidth: 1,
            borderRadius: 15,
            paddingLeft: 15,
            justifyContent: "center",
          }}
        >
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
    </View>
  );
};

export default VehicleDetailsPicker;
