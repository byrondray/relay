import { RequestWithChildrenAndParent } from "@/graphql/generated";
import React from "react";
import { View, Text, Image } from "react-native";
import StartingPin from '@/assets/images/starting-pin.svg';
import EndingPin from '@/assets/images/ending-pin.svg';
import RequestPin from '@/assets/images/request-pin.svg';
import MapView, { Marker, Polyline } from "react-native-maps";

type RideMapProps = {
  mapRef: React.RefObject<MapView>;
  requests: RequestWithChildrenAndParent[];
  startingLatLng: { lat: number; lon: number };
  endingLatLng: { lat: number; lon: number };
  startingAddress: string;
  endingAddress: string;
  previousRoutes: Array<{
    coordinates: Array<{ latitude: number; longitude: number }>;
    predictedTime?: string;
  }>;
  coordinates: Array<{ latitude: number; longitude: number }>;
  activeRoute: {
    coordinates: Array<{ latitude: number; longitude: number }>;
    predictedTime?: string;
  };
  setActiveRoute: (route: {
    coordinates: Array<{ latitude: number; longitude: number }>;
    predictedTime?: string;
  }) => void;
  setPreviousRoutes: (
    routes: Array<{
      coordinates: Array<{ latitude: number; longitude: number }>;
      predictedTime?: string;
    }>
  ) => void;
  styles: any;
  isActiveRoute: (route: {
    coordinates: Array<{ latitude: number; longitude: number }>;
    predictedTime?: string;
  }) => boolean;
  areCoordinatesEqual: (
    coords1: Array<{ latitude: number; longitude: number }>,
    coords2: Array<{ latitude: number; longitude: number }>
  ) => boolean;
  setSelectedWaypoints: (waypoints: RequestWithChildrenAndParent[]) => void;
};

const RideMap: React.FC<RideMapProps> = ({
  mapRef,
  requests,
  startingLatLng,
  endingLatLng,
  startingAddress,
  endingAddress,
  previousRoutes,
  coordinates,
  activeRoute,
  setActiveRoute,
  setPreviousRoutes,
  styles,
  isActiveRoute,
  areCoordinatesEqual,
  setSelectedWaypoints,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: 300, marginTop: 20 }}
        initialRegion={{
          latitude: 49.2827,
          longitude: -123.1207,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
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
              {/* <Image
                source={require("@/assets/images/pin-icon.png")}
                style={styles.markerImage}
              /> */}
              <RequestPin width={30} height={30} />
              <View style={styles.letterContainer}>
                <Text style={[styles.letterText, { fontFamily: "Comfortaa" }]}>
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
            <View style={styles.markerContainer}>
              {/* <Image
                source={require("@/assets/images/starting-pin.png")}
                style={styles.markerImage}
              /> */}
              <StartingPin width={40} height={40} />
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
            <View style={styles.markerContainer}>
              {/* <Image
                source={require("@/assets/images/ending-pin.png")}
                style={styles.markerImage}
              /> */}
              <EndingPin width={40} height={40} />
            </View>
          </Marker>
        )}

        {previousRoutes.map((route, index) => (
          <>
          <Polyline
            key={`previous-route-${index}`}
            coordinates={route.coordinates}
            strokeColor={isActiveRoute(route) ? "#FF6A00" : "#FF6A00"}
            strokeWidth={isActiveRoute(route) ? 8 : 6}
            // lineDashPattern={isActiveRoute(route) ? [] : [10, 10]}
            tappable={true}
            onPress={() => {
              if (route.coordinates && route.coordinates.length > 0) {
                setActiveRoute({
                  coordinates: route.coordinates,
                  predictedTime: route.predictedTime,
                });
              }

              const newSelectedWaypoints = requests.filter((request) =>
                route.coordinates.some(
                  (coord) =>
                    parseFloat(request.startingLat) === coord.latitude &&
                    parseFloat(request.startingLon) === coord.longitude
                )
              );z

              setSelectedWaypoints(newSelectedWaypoints);

              if (
                activeRoute.coordinates.length > 0 &&
                !previousRoutes.some((r) =>
                  areCoordinatesEqual(r.coordinates, activeRoute.coordinates)
                )
              ) {
                setPreviousRoutes([
                  ...previousRoutes,
                  {
                    coordinates: activeRoute.coordinates,
                    predictedTime: activeRoute.predictedTime,
                  },
                ]);
              }
            }}
          />
          <Polyline
            key={`previous-route-${index}`}
            coordinates={route.coordinates}
            strokeColor={isActiveRoute(route) ? "#FFC195" : "# FFF2E9"}
            strokeWidth={isActiveRoute(route) ? 6 : 4}
            // lineDashPattern={isActiveRoute(route) ? [] : [10, 10]}
            tappable={true}
            onPress={() => {
              if (route.coordinates && route.coordinates.length > 0) {
                setActiveRoute({
                  coordinates: route.coordinates,
                  predictedTime: route.predictedTime,
                });
              }

              const newSelectedWaypoints = requests.filter((request) =>
                route.coordinates.some(
                  (coord) =>
                    parseFloat(request.startingLat) === coord.latitude &&
                    parseFloat(request.startingLon) === coord.longitude
                )
              );

              setSelectedWaypoints(newSelectedWaypoints);

              if (
                activeRoute.coordinates.length > 0 &&
                !previousRoutes.some((r) =>
                  areCoordinatesEqual(r.coordinates, activeRoute.coordinates)
                )
              ) {
                setPreviousRoutes([
                  ...previousRoutes,
                  {
                    coordinates: activeRoute.coordinates,
                    predictedTime: activeRoute.predictedTime,
                  },
                ]);
              }
            }}
          />
          </>
        ))}

        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates.map((coord) => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            }))}
            fillColor="#FFC195"
            strokeColor="#FF6A00"
            strokeWidth={5}
          />
        )}
      </MapView>

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

export default RideMap;
