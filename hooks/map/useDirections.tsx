import { useState } from "react";
import { decodePolyline } from "@/components/MapUtils";

export const useDirections = () => {
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [predictedTime, setPredictedTime] = useState("");

  const getDirections = async (
    origin: string,
    destination: string,
    waypoints: { latitude: number; longitude: number }[],
    departureTime: Date
  ) => {
    if (origin && destination) {
      try {
        const originEncoded = encodeURIComponent(origin);
        const destinationEncoded = encodeURIComponent(destination);
        const waypointsEncoded = waypoints.length
          ? `&waypoints=optimize:true|${waypoints
              .map((wp) => `${wp.latitude},${wp.longitude}`)
              .join("|")}`
          : "";

        const departureTimestamp = Math.floor(departureTime.getTime() / 1000);

        const url =
          `https://maps.googleapis.com/maps/api/directions/json` +
          `?origin=${originEncoded}` +
          `&destination=${destinationEncoded}` +
          `${waypointsEncoded}` +
          `&departure_time=${departureTimestamp}` +
          `&traffic_model=pessimistic` +
          `&mode=driving` +
          `&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.status === "OK") {
          const points = json.routes[0].overview_polyline.points;
          const coords = decodePolyline(points);
          setCoordinates(coords);

          const leg = json.routes[0].legs[0];
          const durationInTraffic = leg.duration_in_traffic
            ? leg.duration_in_traffic.text
            : leg.duration.text;
          setPredictedTime(durationInTraffic);

          // Return both coordinates and predicted time for further usage
          return { coordinates: coords, predictedTime: durationInTraffic };
        } else {
          console.log(
            "Error",
            `No route found: ${json.status}. ${json.error_message || ""}`
          );
          return { coordinates: [], predictedTime: "" };
        }
      } catch (error) {
        console.log(
          "Error",
          "An error occurred while fetching directions.",
          error
        );
        return { coordinates: [], predictedTime: "" };
      }
    } else {
      console.log(
        "Input Required",
        "Please enter both origin and destination."
      );
      return { coordinates: [], predictedTime: "" };
    }
  };

  return { coordinates, predictedTime, getDirections };
};
