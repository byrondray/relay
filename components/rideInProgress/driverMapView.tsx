import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface DriverMapViewProps {
  driverLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const DriverMapView: React.FC<DriverMapViewProps> = ({ driverLocation }) => {
  const defaultRegion = {
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const mapRef = useRef<MapView | null>(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (driverLocation && !isCentered) {
      // Center the map only once when the driver starts sharing the location
      mapRef.current?.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000 // Animation duration in milliseconds
      );
      setIsCentered(true); // Prevent further centering
    }
  }, [driverLocation, isCentered]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={defaultRegion}>
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
    borderRadius: 0,
  },
  map: {
    flex: 1,
  },
});

export default DriverMapView;
