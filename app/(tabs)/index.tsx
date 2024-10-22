import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import withAuthCheck from "../../components/WithAuthCheck";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocationAndCommunityCenters } from "@/hooks/map/useMap";
import { useDirections } from "@/hooks/map/useDirections";
import { CommunityCenter } from "@/graphql/generated";
import { useLogout } from "@/hooks/auth/useLogout";
import Reload from "@/assets/images/reload.svg";

function HomeScreen() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const { logout, loading } = useLogout();

  const { userLocation, mapRegion, communityCentersData, setMapRegion } =
    useLocationAndCommunityCenters();
  const { coordinates, predictedTime, getDirections } = useDirections();

  return (
    <ThemedView style={styles.container}>
      <Reload width={-50} height={50} />
      <ThemedAddressCompletionInput
        value={origin}
        onChangeText={setOrigin}
        onSuggestionSelect={setOrigin}
        placeholder="Enter Origin"
      />
      <ThemedAddressCompletionInput
        value={destination}
        onChangeText={setDestination}
        onSuggestionSelect={setDestination}
        placeholder="Enter Destination"
      />
      <ThemedAddressCompletionInput
        value={waypoints}
        onChangeText={setWaypoints}
        onSuggestionSelect={setWaypoints}
        placeholder="Enter Waypoints (comma-separated)"
      />

      <Button
        title="Get Directions"
        onPress={() =>
          getDirections(origin, destination, waypoints, departureTime)
        }
      />

      <Button title="Logout" onPress={() => logout()} />

      {predictedTime ? (
        <ThemedView style={styles.predictedTimeContainer}>
          <ThemedText>
            Predicted Total Travel Time with Traffic: {predictedTime}
          </ThemedText>
        </ThemedView>
      ) : null}

      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
      >
        {/* Community Center Markers */}
        {communityCentersData?.getCommunityCenters?.map(
          (center: CommunityCenter) => (
            <Marker
              key={center.id}
              coordinate={{
                latitude: center.lat,
                longitude: center.lon,
              }}
              title={center.name}
              description={center.address}
              pinColor="green"
            />
          )
        )}

        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />

        {/* Render Polyline for Directions */}
        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#000"
            strokeWidth={4}
          />
        )}
      </MapView>
    </ThemedView>
  );
}

export default withAuthCheck(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 0,
  },
  predictedTimeContainer: {
    padding: 8,
    marginVertical: 8,
  },
  map: {
    flex: 1,
    width: "100%",
    height: 400,
  },
});
