import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  CarpoolWithRequests,
  RequestWithParentAndChild,
} from "@/graphql/generated";
import { Image } from "react-native";

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const screenHeight = Dimensions.get("window").height;

  const animatedHeight = useRef(new Animated.Value(300)).current;

  const inactivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleFullScreen = () => {
    const toValue = isFullScreen ? 300 : screenHeight;
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFullScreen((prev) => !prev);
  };

  const centerOnDriverLocation = () => {
    if (driverLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const centerOnCarpoolStart = () => {
    if (carpoolData?.startLat && carpoolData?.startLon && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: carpoolData.startLat,
          longitude: carpoolData.startLon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const onUserInteraction = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    inactivityTimeout.current = setTimeout(() => {
      centerOnDriverLocation();
    }, 7000);
  };

  useEffect(() => {
    if (driverLocation) {
      centerOnDriverLocation();
    } else if (carpoolData?.startLat && carpoolData?.startLon) {
      centerOnCarpoolStart();
    }
  }, [driverLocation, carpoolData]);

  useEffect(() => {
    return () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onUserInteraction();
        Keyboard.dismiss();
      }}
    >
      <Animated.View style={[styles.container, { height: animatedHeight }]}>
        <MapView ref={mapRef} style={styles.map} initialRegion={defaultRegion}>
          {carpoolData?.startLat && carpoolData?.startLon && (
            <Marker
              coordinate={{
                latitude: carpoolData.startLat,
                longitude: carpoolData.startLon,
              }}
              title={carpoolData.startAddress}
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
              title="Driver Location"
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
              pinColor="blue"
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
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => {
            toggleFullScreen();
          }}
        >
          <Text style={styles.expandButtonText}>
            {isFullScreen ? "Minimize" : "Expand"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableWithoutFeedback>
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
  expandButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  expandButtonText: {
    color: "white",
    fontSize: 16,
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
});

export default DriverMapView;
