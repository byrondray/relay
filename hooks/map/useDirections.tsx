import { useState } from "react";
import { Alert } from "react-native";
import { decodePolyline } from "@/components/MapUtils";

export const useDirections = () => {
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [predictedTime, setPredictedTime] = useState("");

  const getDirections = async (
    origin: string,
    destination: string,
    waypoints: string,
    departureTime: Date
  ) => {
    if (origin && destination) {
      try {
        const originEncoded = encodeURIComponent(origin);
        const destinationEncoded = encodeURIComponent(destination);
        const waypointsEncoded = waypoints
          ? `&waypoints=${encodeURIComponent(waypoints)}`
          : "";

        const departureTimestamp = Math.floor(departureTime.getTime() / 1000);

        const url =
          `https://maps.googleapis.com/maps/api/directions/json` +
          `?origin=${originEncoded}` +
          `&destination=${destinationEncoded}` +
          `${waypointsEncoded}` +
          `&departure_time=${departureTimestamp}` +
          `&traffic_model=best_guess` +
          `&mode=driving` +
          `&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.status === "OK") {
          const points = json.routes[0].overview_polyline.points;
          const coords = decodePolyline(points);
          setCoordinates(coords);

          const leg = json.routes[0].legs[0];
          const durationInTraffic = leg.duration_in_traffic.text;
          setPredictedTime(durationInTraffic);
        } else {
          Alert.alert(
            "Error",
            `No route found: ${json.status}. ${json.error_message || ""}`
          );
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching directions.");
      }
    } else {
      Alert.alert(
        "Input Required",
        "Please enter both origin and destination."
      );
    }
  };

  return { coordinates, predictedTime, getDirections };
};
