import {
  CarpoolWithRequests,
  RequestWithParentAndChild,
} from "@/graphql/generated";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

interface DriverMapViewProps {
  driverLocation: {
    latitude: number;
    longitude: number;
  } | null;
  requests: RequestWithParentAndChild[];
  polyline: { latitude: number; longitude: number }[]; 
  carpoolData: CarpoolWithRequests;
}

const DriverMapView: React.FC<DriverMapViewProps> = ({
  driverLocation,
  requests,
  polyline,
  carpoolData,
}) => {
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
      mapRef.current?.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000 
      );
      setIsCentered(true); 
    }
  }, [driverLocation, isCentered]);

  useEffect(() => {
    if (polyline.length > 0) {
      mapRef.current?.fitToCoordinates(polyline, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [polyline]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={defaultRegion}>
        {carpoolData?.startLat && carpoolData?.startLon && (
          <Marker
            coordinate={{
              latitude: carpoolData.startLat,
              longitude: carpoolData.startLon,
            }}
            title={carpoolData.startAddress}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("@/assets/images/starting-pin.png")}
                style={styles.markerImage}
              />
            </View>
          </Marker>
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

        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
          >
            <View
              style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "white",
              }}
            >
              <Text style={{ fontSize: 14, color: "white" }}>🚗</Text>
            </View>
          </Marker>
        )}
        {requests.map((request, index) => (
          <Marker
            key={request.id || index}
            coordinate={{
              latitude: request.startLat,
              longitude: request.startLon,
            }}
            pinColor="blue" // You can customize the pin color
            title={`Stop ${index + 1}`}
            description={request.startAddress}
          />
        ))}
        {polyline.length > 0 && (
          <Polyline
            coordinates={polyline}
            strokeColor={"#FF6A00"}
            strokeWidth={5}
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

export default DriverMapView;
