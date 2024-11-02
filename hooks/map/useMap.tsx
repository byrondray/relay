import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useLazyQuery } from "@apollo/client";
import { GET_COMMUNITY_CENTERS } from "@/graphql/map/queries";
import { Alert } from "react-native";

export const useLocationAndCommunityCenters = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
  });
  const [hasFetchedCenters, setHasFetchedCenters] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [fetchCommunityCenters, { data: communityCentersData, error }] =
    useLazyQuery(GET_COMMUNITY_CENTERS);

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      if (!hasFetchedCenters) {
        fetchCommunityCenters({ variables: { lat: latitude, lon: longitude } });
        setHasFetchedCenters(true);
      }
    };

    getUserLocation();
  }, [hasFetchedCenters]);

  if (error) {
    Alert.alert("Error", "Failed to fetch community centers.");
  }

  return { userLocation, mapRegion, communityCentersData, setMapRegion };
};
