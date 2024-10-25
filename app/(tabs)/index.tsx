import React, { useState, useEffect } from "react";
import { Button, StyleSheet, ActivityIndicator } from "react-native";
import withAuthCheck from "../../components/WithAuthCheck";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocationAndCommunityCenters } from "@/hooks/map/useMap";
import { useDirections } from "@/hooks/map/useDirections";
import { CommunityCenter } from "@/graphql/generated";
import { useLogout } from "@/hooks/auth/useLogout";
import { useQuery } from "@apollo/client";
import { HAS_USER_ON_BOARDED } from "@/graphql/queries";
import { router, Href } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const { logout, loading: logoutLoading } = useLogout();
  const [startingLatLng, setStartingLatLng] = useState({ lat: 0, lon: 0 });
  const [endingLatLng, setEndingLatLng] = useState({ lat: 0, lon: 0 });
  const [waypointsLatLng, setLatLng] = useState({ lat: 0, lon: 0 });

  const { userLocation, mapRegion, communityCentersData, setMapRegion } =
    useLocationAndCommunityCenters();
  const { coordinates, predictedTime, getDirections } = useDirections();

  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  const {
    data,
    loading: onboardingLoading,
    error,
  } = useQuery(HAS_USER_ON_BOARDED, {
    skip: hasOnboarded !== null,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const storedOnboardingStatus = await AsyncStorage.getItem(
          "hasOnboarded"
        );
        if (storedOnboardingStatus !== null) {
          setHasOnboarded(storedOnboardingStatus === "true");
        } else {
          if (data && !data.hasUserOnBoarded) {
            await AsyncStorage.setItem("hasOnboarded", "false");
            router.push("/OnboardForms/parent");
          } else if (data?.hasUserOnBoarded) {
            await AsyncStorage.setItem("hasOnboarded", "true");
            setHasOnboarded(true);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, [data]);

  if (onboardingLoading || hasOnboarded === null) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>
          Error checking onboarding status: {error.message}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedAddressCompletionInput
        value={origin}
        onChangeText={setOrigin}
        onSuggestionSelect={(address) => {
          console.log("Selected Address:", address);
        }}
        onLatLonSelect={(lat, lon) => {
          setStartingLatLng({ lat, lon });
          console.log("Selected Lat/Lon:", lat, lon);
        }}
        placeholder="Enter Origin"
      />
      <ThemedAddressCompletionInput
        value={destination}
        onChangeText={setDestination}
        onSuggestionSelect={setDestination}
        onLatLonSelect={(lat, lon) => {
          setEndingLatLng({ lat, lon });
          console.log("Selected Lat/Lon:", lat, lon);
        }}
        placeholder="Enter Destination"
      />
      <ThemedAddressCompletionInput
        value={waypoints}
        onChangeText={setWaypoints}
        onSuggestionSelect={setWaypoints}
        onLatLonSelect={(lat, lon) => {
          setLatLng({ lat, lon });
          console.log("Selected Lat/Lon:", lat, lon);
        }}
        placeholder="Enter Waypoints (comma-separated)"
      />

      <Button
        title="Get Directions"
        onPress={() =>
          getDirections(origin, destination, waypoints, departureTime)
        }
      />

      <Button title="Logout" onPress={() => logout()} />
      <Button
        title="Forms"
        onPress={() =>
          router.push("/OnboardForms/parent" as Href<"/OnboardForms/parent">)
        }
      />
      <Button
        title="Create a group"
        onPress={() => router.push("/group/createGroup")}
      />

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
