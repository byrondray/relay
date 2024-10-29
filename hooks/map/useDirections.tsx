import { useState } from "react";
import { decodePolyline } from "@/components/MapUtils";

export const useDirections = () => {
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [predictedTime, setPredictedTime] = useState("");

  const getDirections = async (
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number },
    waypoints: { latitude: number; longitude: number }[],
    departureTime: Date
  ) => {
    if (origin && destination) {
      try {
        console.log("Origin:", origin);
        console.log("Destination:", destination);
        console.log("Waypoints:", waypoints);

        const originCoordinates = `${origin.lat},${origin.lon}`;
        const destinationCoordinates = `${destination.lat},${destination.lon}`;
        const waypointsEncoded = waypoints.length
          ? `&waypoints=optimize:true|${waypoints
              .map((wp) => `${wp.latitude},${wp.longitude}`)
              .join("|")}`
          : "";

        const departureTimestamp = Math.floor(departureTime.getTime() / 1000);

        const url =
          `https://maps.googleapis.com/maps/api/directions/json` +
          `?origin=${originCoordinates}` +
          `&destination=${destinationCoordinates}` +
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

          const totalDuration = json.routes[0].legs.reduce(
            (acc: number, leg: any) => {
              const legDuration = leg.duration_in_traffic
                ? leg.duration_in_traffic.value 
                : leg.duration.value;
              return acc + legDuration;
            },
            0
          );

          const hours = Math.floor(totalDuration / 3600);
          const minutes = Math.floor((totalDuration % 3600) / 60);
          const durationString = `${
            hours > 0 ? `${hours}h ` : ""
          }${minutes}min`;

          console.log("Total Duration in Traffic:", durationString);
          setPredictedTime(durationString);

          return { coordinates: coords, predictedTime: durationString };
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
