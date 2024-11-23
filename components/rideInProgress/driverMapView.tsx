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
import { useTheme } from "@/contexts/ThemeContext";

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
  const [propsReady, setPropsReady] = useState(false);
  const animatedHeight = useRef(new Animated.Value(300)).current;
  const inactivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const checkPropsReady = () => {
    return (
      carpoolData?.startLat !== undefined &&
      carpoolData?.startLon !== undefined &&
      carpoolData?.endLat !== undefined &&
      carpoolData?.endLon !== undefined &&
      requests.length > 0 &&
      polyline.length > 0
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (checkPropsReady()) {
        setPropsReady(true);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [carpoolData, requests, polyline, driverLocation]);

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
    if (
      carpoolData?.startLat &&
      carpoolData?.startLon &&
      mapRef.current &&
      propsReady
    ) {
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

  useEffect(() => {
    if (mapInitialized && propsReady) {
      const timeout = setTimeout(() => {
        if (driverLocation) {
          centerOnDriverLocation();
        } else if (carpoolData?.startLat && carpoolData?.startLon) {
          centerOnCarpoolStart();
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [mapInitialized, propsReady, carpoolData]);

  const { currentColors } = useTheme();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Animated.View style={[styles.container, { height: animatedHeight }]}>
        <MapView
          key={propsReady ? "propsReady" : "notReady"}
          ref={mapRef}
          style={styles.map}
          initialRegion={defaultRegion}
          onLayout={() => {
            if (!mapInitialized) {
              setMapInitialized(true); // Fallback
            }
          }}
          onMapReady={() => {
            setMapInitialized(true);
          }}
        >
          {carpoolData?.startLat && carpoolData?.startLon && (
            <Marker
              key={carpoolData.startAddress}
              coordinate={{
                latitude: carpoolData.startLat,
                longitude: carpoolData.startLon,
              }}
              title={carpoolData.startAddress}
              pinColor="#FF6A00"
              zIndex={2}
            />
          )}
          {carpoolData?.endLat && carpoolData?.endLon && (
            <Marker
              key={carpoolData.endAddress}
              coordinate={{
                latitude: carpoolData.endLat,
                longitude: carpoolData.endLon,
              }}
              title={carpoolData.endAddress}
              pinColor="#DE4141"
              zIndex={2}
            />
          )}
          {driverLocation && (
            <Marker
              coordinate={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              title="Driver Location"
              zIndex={3}
            >
              <View
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: currentColors.text,
                }}
              >
                <Text style={{ fontSize: 14, color: currentColors.text }}>
                  🚗
                </Text>
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
              zIndex={2}
            />
          ))}
          {polyline.length > 0 && (
            <Polyline
              key={polyline.length}
              coordinates={polyline}
              strokeColor={"#FF6A00"}
              strokeWidth={5}
              zIndex={1}
            />
          )}
        </MapView>
        {!mapInitialized ||
          (!propsReady && (
            <View style={styles.spinnerContainer}>
              <Spinner />
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

export default DriverMapView;
