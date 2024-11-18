import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  CarpoolWithRequests,
  RequestWithParentAndChild,
} from "@/graphql/generated";
import { Image } from "react-native";

interface RequestMapViewProps {
  driverLocation: {
    latitude: number;
    longitude: number;
  } | null;
  currentUserRequest: RequestWithParentAndChild | null;
  polyline: { latitude: number; longitude: number }[];
  carpoolData: CarpoolWithRequests;
}

const RequestMapView: React.FC<RequestMapViewProps> = ({
  driverLocation,
  currentUserRequest,
  carpoolData,
  polyline,
}) => {
  const defaultRegion = {
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const mapRef = useRef<MapView | null>(null);
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    if (driverLocation && !hasCentered && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
      setHasCentered(true);
    }
  }, [driverLocation, hasCentered]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={defaultRegion}>
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            style={{ zIndex: 1 }}
            title="Driver's Location"
          />
        )}
        {currentUserRequest && (
          <Marker
            coordinate={{
              latitude: currentUserRequest.startLat,
              longitude: currentUserRequest.startLon,
            }}
            pinColor="blue" // Customize the marker color
            title="Your Stop"
            description={currentUserRequest.startAddress}
          />
        )}
        {carpoolData?.endLat && carpoolData?.endLon && (
          <Marker
            coordinate={{
              latitude: carpoolData.endLat,
              longitude: carpoolData.endLon,
            }}
            title={carpoolData.endAddress}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("@/assets/images/ending-pin.png")}
                style={styles.markerImage}
              />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 110,
    backgroundColor: "transparent",
  },
  markerImage: {
    width: 40,
    height: 60,
    resizeMode: "contain",
  },
  letterContainer: {
    position: "absolute",
    top: 5,
    backgroundColor: "#000",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  letterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  predictedTimeBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    alignItems: "center",
  },
  predictedTimeText: {
    color: "#fff",
    fontSize: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  avatar: {
    marginHorizontal: 4,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default RequestMapView;
