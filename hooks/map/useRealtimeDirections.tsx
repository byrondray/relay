import { useState } from "react";
import { decodePolyline } from "@/components/MapUtils";

const mapLegsToOriginalRequests = (
  legs: { duration: string; polyline: any }[],
  originalRequests: { startLat: number; startLon: number }[],
  filteredRequests: { startLat: number; startLon: number }[],
  finalDestination: { lat: number; lon: number }
) => {
  if (legs.length !== filteredRequests.length + 1) {
    console.warn(
      `Mismatch between legs and filtered requests: Legs(${legs.length}), Filtered Requests(${filteredRequests.length + 1})`
    );
  }

  const filteredMap = new Map(
    filteredRequests.map((req, index) => [
      `${req.startLat},${req.startLon}`,
      legs[index],
    ])
  );

  const mapped = originalRequests.map((req) => {
    const key = `${req.startLat},${req.startLon}`;
    const leg = filteredMap.get(key);
    if (!leg) {
      console.warn(
        `No matching leg found for request at ${req.startLat}, ${req.startLon}`
      );
    }
    return {
      request: req,
      duration: leg?.duration || "Unknown",
      polyline: leg?.polyline || [],
    };
  });

  const lastLeg = legs[legs.length - 1];
  if (lastLeg) {
    mapped.push({
      request: {
        startLat: finalDestination.lat,
        startLon: finalDestination.lon,
      },
      duration: lastLeg.duration,
      polyline: lastLeg.polyline,
    });
  } else {
    console.warn("No last leg found for the final destination.");
  }

  return mapped;
};

const removeDuplicateRequests = (
  requests: { startLat: number; startLon: number }[]
) => {
  const seen = new Set();
  return requests.filter((req) => {
    const key = `${req.startLat},${req.startLon}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
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
  const [lastLegTime, setLastLegTime] = useState<string>("");

  const getRealtimeDirections = async (
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number },
    waypoints: { latitude: number; longitude: number }[],
    requests: { startLat: number; startLon: number }[],
    departureTime: Date
  ) => {
    if (origin && destination) {
      try {
        const originalRequests = [...requests];
        const filteredRequests = removeDuplicateRequests(requests);

        const filteredWaypoints = filteredRequests.map((req) => ({
          latitude: req.startLat,
          longitude: req.startLon,
        }));

        const originCoordinates = `${origin.lat},${origin.lon}`;
        const destinationCoordinates = `${destination.lat},${destination.lon}`;
        const waypointsEncoded = filteredWaypoints.length
          ? `&waypoints=|${filteredWaypoints
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
            polyline: leg.steps
              ? decodePolyline(
                  leg.steps.map((step: any) => step.polyline.points).join("")
                )
              : [],
          }));

          const mappedLegs = mapLegsToOriginalRequests(
            routeLegs,
            originalRequests,
            filteredRequests,
            destination
          );

          const lastLeg = routeLegs[routeLegs.length - 1];
          const lastLegDuration = lastLeg?.duration || "Unknown";
          setLastLegTime(lastLegDuration);

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

          return {
            polyline: coords,
            legs: mappedLegs,
            lastLegTime: lastLegDuration,
          };
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
    lastLegTime,
    getRealtimeDirections,
  };
};
