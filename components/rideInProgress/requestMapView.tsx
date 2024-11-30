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
import { Spinner } from "@ui-kitten/components";
import { set } from "date-fns";

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const [propsReady, setPropsReady] = useState(false);
  const animatedHeight = useRef(new Animated.Value(300)).current;
  const inactivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const checkPropsReady = () => {
    return (
      currentUserRequest !== null &&
      polyline.length > 0 &&
      carpoolData?.endLat !== undefined &&
      carpoolData?.endLon !== undefined
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (checkPropsReady()) {
        setPropsReady(true);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [driverLocation, currentUserRequest, polyline, carpoolData]);

  const toggleFullScreen = () => {
    const toValue = isFullScreen ? 300 : screenHeight;
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    if (mapInitialized && propsReady) {
      const timeout = setTimeout(() => {
        if (driverLocation) {
          mapRef.current?.animateToRegion(
            {
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            1000
          );
        } else if (currentUserRequest) {
          mapRef.current?.animateToRegion(
            {
              latitude: currentUserRequest.startLat,
              longitude: currentUserRequest.startLon,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            1000
          );
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [mapInitialized, propsReady, driverLocation, currentUserRequest]);

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
        if (inactivityTimeout.current) {
          clearTimeout(inactivityTimeout.current);
        }
        Keyboard.dismiss();
      }}
    >
      <Animated.View style={[styles.container, { height: animatedHeight }]}>
        {propsReady ? (
          <MapView
            key={propsReady ? "propsReady" : "notReady"}
            ref={mapRef}
            style={styles.map}
            initialRegion={defaultRegion}
            onLayout={() => setMapInitialized(true)}
            onMapReady={() => setMapInitialized(true)}
          >
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
                pinColor="blue"
                title="Your Stop"
                description={currentUserRequest.startAddress}
              />
            )}
            {carpoolData?.startLat && carpoolData?.startLon && (
              <Marker
                coordinate={{
                  latitude: carpoolData.startLat,
                  longitude: carpoolData.startLon,
                }}
                title={carpoolData.startAddress}
                anchor={{ x: 0.5, y: 0.5 }}
                pinColor="#FF6A00"
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
                pinColor="#DE4141"
              />
            )}
            {polyline.length > 0 && (
              <Polyline
                coordinates={polyline}
                strokeColor={"#FF6A00"}
                strokeWidth={5}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.spinnerContainer}>
            <Spinner />
          </View>
        )}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={toggleFullScreen}
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
    borderRadius: 8,
    overflow: "hidden",
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
  spinnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RequestMapView;
