// GestureMap.tsx
import { RequestWithChildrenAndParent } from "@/graphql/generated";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PanResponderInstance,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

type RouteCoordinates = {
  latitude: number;
  longitude: number;
}[];

type Route = {
  coordinates: RouteCoordinates;
  predictedTime?: string;
};

const GestureMap = ({
  mapHeight,
  isFullScreen,
  requests,
  startingLatLng,
  startingAddress,
  endingLatLng,
  endingAddress,
  previousRoutes,
  coordinates,
  activeRoute,
  panResponder,
  toggleFullScreen,
  handleLongPress,
}: {
  mapHeight: Animated.Value;
  isFullScreen: boolean;
  requests: RequestWithChildrenAndParent[];
  startingLatLng: { lat: number; lon: number };
  startingAddress: string;
  endingLatLng: { lat: number; lon: number };
  endingAddress: string;
  previousRoutes: Route[];
  coordinates: RouteCoordinates;
  activeRoute: Route;
  panResponder: PanResponderInstance;
  toggleFullScreen: (expand: boolean) => void;
  handleLongPress: (e: any) => void;
}) => {
  const isActiveRoute = (route: Route) => route === activeRoute;

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ height: mapHeight }}>
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: 49.25,
            longitude: -123.0014,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onLongPress={handleLongPress}
        >
          {requests.map((request, index) => (
            <Marker
              key={request.id}
              coordinate={{
                latitude: parseFloat(request.startingLat),
                longitude: parseFloat(request.startingLon),
              }}
              title={request.startAddress}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={require("@/assets/images/pin-icon.png")}
                  style={styles.markerImage}
                />
                <View style={styles.letterContainer}>
                  <Text
                    style={[styles.letterText, { fontFamily: "Comfortaa" }]}
                  >
                    {index + 1}
                  </Text>
                </View>
              </View>
            </Marker>
          ))}

          {startingLatLng.lat !== 0 && (
            <Marker
              coordinate={{
                latitude: startingLatLng.lat,
                longitude: startingLatLng.lon,
              }}
              title={startingAddress}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("@/assets/images/starting-pin.png")}
                  style={{ width: 40, height: 40, resizeMode: "contain" }}
                />
              </View>
            </Marker>
          )}

          {endingLatLng.lat !== 0 && (
            <Marker
              coordinate={{
                latitude: endingLatLng.lat,
                longitude: endingLatLng.lon,
              }}
              title={endingAddress}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={require("@/assets/images/ending-pin.png")}
                  style={{ width: 40, height: 40, resizeMode: "contain" }}
                />
              </View>
            </Marker>
          )}

          {previousRoutes.map((route, index) => (
            <Polyline
              key={`previous-route-${index}`}
              coordinates={route.coordinates}
              strokeColor={isActiveRoute(route) ? "#FF6A00" : "#ff9950"}
              strokeWidth={isActiveRoute(route) ? 5 : 4}
              lineDashPattern={isActiveRoute(route) ? [] : [10, 10]}
              tappable={true}
            />
          ))}

          {coordinates.length > 0 && (
            <Polyline
              coordinates={coordinates}
              fillColor="#FFC195"
              strokeColor="#FF6A00"
              strokeWidth={5}
            />
          )}
        </MapView>
      </Animated.View>

      <View
        {...panResponder.panHandlers}
        style={{
          width: "100%",
          alignItems: "center",
          paddingVertical: 10,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            width: 60,
            height: 5,
            backgroundColor: "#FF8833",
            borderRadius: 3,
          }}
        />
      </View>

      {isFullScreen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
            elevation: 5,
          }}
          onPress={() => toggleFullScreen(false)}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/ios-filled/50/000000/close-window.png",
            }}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      )}

      {activeRoute.predictedTime && (
        <View style={styles.predictedTimeBox}>
          <Text style={[styles.predictedTimeText, { fontFamily: "Comfortaa" }]}>
            {`Estimated Time: ${activeRoute.predictedTime}`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default GestureMap;
