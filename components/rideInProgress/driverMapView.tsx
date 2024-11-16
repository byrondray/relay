import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface DriverMapViewProps {
  driverLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const DriverMapView: React.FC<DriverMapViewProps> = ({ driverLocation }) => {
  // Define the default region in case `driverLocation` is not available
  const defaultRegion = {
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Use either the driver's location or the default region
  const region = driverLocation
    ? {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : defaultRegion;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        {/* Render a marker if `driverLocation` is available */}
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            title="Driver's Location"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});

export default DriverMapView;
