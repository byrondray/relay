import { useState } from "react";
import { decodePolyline } from "@/components/MapUtils";

const mapLegsToRequests = (
  legs: { duration: string; polyline: any }[],
  requests: { startLat: number; startLon: number }[]
) => {
  return legs.map((leg, index) => ({
    request: requests[index],
    duration: leg.duration,
    polyline: leg.polyline,
  }));
};

export const useRealtimeDirections = () => {
  const [polyline, setPolyline] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [totalPredictedTime, setTotalPredictedTime] = useState("");
  const [timeToNextStop, setTimeToNextStop] = useState("");
  const [legs, setLegs] = useState<
    { duration: string; polyline: any; request?: any }[]
  >([]);
  const [directionsLog, setDirectionsLog] = useState<string[]>([]);

  const getRealtimeDirections = async (
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number },
    waypoints: { latitude: number; longitude: number }[],
    requests: { startLat: number; startLon: number }[],
    departureTime: Date
  ) => {
    if (origin && destination) {
      try {
        const originCoordinates = `${origin.lat},${origin.lon}`;
        const destinationCoordinates = `${destination.lat},${destination.lon}`;
        const waypointsEncoded = waypoints.length
          ? `&waypoints=|${waypoints
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
          const route = json.routes[0];
          const points = route.overview_polyline.points;
          const coords = decodePolyline(points);
          setPolyline(coords);

          const routeLegs = route.legs.map((leg: any) => ({
            duration: `${Math.floor(leg.duration.value / 60)} min`,
            polyline: decodePolyline(
              leg.steps.map((step: any) => step.polyline.points).join("")
            ),
          }));

          const mappedLegs = mapLegsToRequests(routeLegs, requests);
          setLegs(mappedLegs);

          setTotalPredictedTime(
            `${Math.floor(
              route.legs.reduce(
                (acc: number, leg: { duration: { value: number } }) =>
                  acc + leg.duration.value,
                0
              ) / 60
            )} min`
          );
          setTimeToNextStop(mappedLegs[0]?.duration || "");

          return { polyline: coords, legs: mappedLegs };
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    }
  };

  return {
    polyline,
    totalPredictedTime,
    timeToNextStop,
    directionsLog,
    legs,
    getRealtimeDirections,
  };
};
