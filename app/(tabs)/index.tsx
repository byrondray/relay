import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  Touchable,
} from "react-native";
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
import { useQuery } from "@apollo/client";
import { HAS_USER_ON_BOARDED } from "@/graphql/queries";
import { router, Href } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_CHILDREN_FOR_USER } from "@/graphql/queries";
import { TouchableOpacity } from "react-native-gesture-handler";
import { processFontFamily } from "expo-font";

function HomeScreen() {
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
      <Text style={[styles.heading, { fontFamily: "Comfortaa" }]}>
        New Ride
      </Text>
      <ThemedView style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Carpool/createRide")}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F7F9FC",
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 30,
              borderColor: "#E4E9F2",
              borderWidth: 1,
              height: 100,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  fontWeight: "semibold",
                  marginBottom: 3,
                }}
              >
                I'm a driver
              </Text>
              <Text style={{ color: "#8F9BB3", fontSize: 16 }}>
                I'm available to carpool other kids.
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: "#222B45",
              }}
            />
          </View>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Carpool/requestRide" as Href)}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F7F9FC",
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 30,
              borderColor: "#E4E9F2",
              borderWidth: 1,
              height: 100,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  fontWeight: "semibold",
                  marginBottom: 3,
                }}
              >
                Looking for a ride for my kid
              </Text>
              <Text style={{ color: "#8F9BB3", fontSize: 16 }}>
                Notify me when a ride matches
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: "#222B45",
              }}
            />
          </View>
        </TouchableOpacity>
      </ThemedView>
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
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

{
  /*   <ThemedAddressCompletionInput
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

        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />

        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#000"
            strokeWidth={4}
          />
        )}

        
      </MapView> */
}
