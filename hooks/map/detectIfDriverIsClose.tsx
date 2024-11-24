import { useEffect, useRef } from "react";
import { RequestWithParentAndChild } from "@/graphql/generated";

interface UseCarpoolProximityArgs {
  requests: RequestWithParentAndChild[];
  endingLat: number;
  endingLon: number;
  currentIndex: number;
  onStopReached: (stop: RequestWithParentAndChild) => void;
  onTripCompleted: () => void;
  driverLocation?: { latitude: number; longitude: number } | null;
}

export const useCarpoolProximity = ({
  requests,
  endingLat,
  endingLon,
  currentIndex,
  onStopReached,
  onTripCompleted,
  driverLocation,
}: UseCarpoolProximityArgs) => {
  const intervalRef = useRef<number | null>(null);
  const lastCheckedLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    console.log("useCarpoolProximity triggered:", {
      currentIndex,
      driverLocation,
    });

    if (!driverLocation) {
      console.log(
        "Driver location not available. Skipping proximity monitoring."
      );
      return;
    }

    const currentStop =
      currentIndex < requests.length ? requests[currentIndex] : null;
    const targetLat = currentStop?.startLat || endingLat;
    const targetLon = currentStop?.startLon || endingLon;

    const proximityCheck = () => {
      const { latitude, longitude } = driverLocation;

      // Skip if the driver location hasn't significantly changed
      if (
        lastCheckedLocationRef.current &&
        haversineDistance(
          {
            lat: lastCheckedLocationRef.current.latitude,
            lon: lastCheckedLocationRef.current.longitude,
          },
          { lat: latitude, lon: longitude }
        ) < 20
      ) {
        return;
      }

      lastCheckedLocationRef.current = { latitude, longitude }; // Update last checked location

      const distance = haversineDistance(
        { lat: latitude, lon: longitude },
        { lat: targetLat, lon: targetLon }
      );

      console.log(`Distance to target (${targetLat}, ${targetLon}):`, distance);

      if (distance <= 150) {
        if (currentStop) {
          console.log("Stop reached:", currentStop);
          onStopReached(currentStop);
        } else {
          console.log("Final destination reached.");
          onTripCompleted();
        }
        clearMonitoring(); // Stop monitoring once target is reached
      }
    };

    const clearMonitoring = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("Clearing interval with ID:", intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start monitoring
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(proximityCheck, 1000);
      console.log("Interval created with ID:", intervalRef.current);
    }

    return () => {
      clearMonitoring(); // Cleanup on unmount or effect re-run
    };
  }, [
    currentIndex,
    driverLocation,
    requests,
    endingLat,
    endingLon,
    onStopReached,
    onTripCompleted,
  ]);
};

// Haversine Distance Calculation
const haversineDistance = (
  coords1: { lat: number; lon: number },
  coords2: { lat: number; lon: number }
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert to meters
};
