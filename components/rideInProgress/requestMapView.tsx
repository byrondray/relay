import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface RequestMapViewProps {
  driverLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const RequestMapView: React.FC<RequestMapViewProps> = ({ driverLocation }) => {
  const defaultRegion = {
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const [region, setRegion] = useState(defaultRegion);

  useEffect(() => {
    // Update region when driverLocation changes
    if (driverLocation) {
      setRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      setRegion(defaultRegion);
    }
  }, [driverLocation]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
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
      {!driverLocation && (
        <MapView style={styles.map} region={region}></MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  noLocation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  map: {
    flex: 1,
  },
});

export default RequestMapView;
