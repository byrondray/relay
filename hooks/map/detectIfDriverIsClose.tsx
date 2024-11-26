import { useEffect, useRef, useState } from "react";
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
  const [hasReachedStop, setHasReachedStop] = useState(false);

  useEffect(() => {
    if (!driverLocation) {
      console.warn("Driver location not available. Skipping proximity check.");
      return;
    }

    const currentStop =
      currentIndex < requests.length ? requests[currentIndex] : null;
    const targetLat = currentStop?.startLat || endingLat;
    const targetLon = currentStop?.startLon || endingLon;

    const proximityCheck = () => {
      if (!driverLocation) return;

      const { latitude, longitude } = driverLocation;
      const distance = haversineDistance(
        { lat: latitude, lon: longitude },
        { lat: targetLat, lon: targetLon }
      );

      console.log(`Distance to target: ${distance} meters`);

      if (distance <= 300) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = null;

        if (currentStop) {
          console.log(`Stop reached: ${currentStop.startAddress}`);
          onStopReached(currentStop);
        } else {
          console.log("Final destination reached.");
          onTripCompleted();
        }
      }
    };

    if (!intervalRef.current) {
      console.log("Initializing proximity interval...");
      intervalRef.current = window.setInterval(proximityCheck, 500);
    }

    return () => {
      if (intervalRef.current) {
        console.log("Clearing proximity interval...");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    currentIndex,
    requests,
    endingLat,
    endingLon,
    onStopReached,
    onTripCompleted,
    driverLocation?.latitude, // Only latitude and longitude as dependencies
    driverLocation?.longitude,
  ]);
  // Reset `hasReachedStop` when the `currentIndex` changes
  useEffect(() => {
    setHasReachedStop(false);
  }, [currentIndex]);
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
