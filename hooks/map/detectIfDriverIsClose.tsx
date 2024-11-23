import { useEffect } from "react";
import * as Location from "expo-location";
import { RequestWithParentAndChild } from "@/graphql/generated";

interface UseCarpoolProximityArgs {
  requests: RequestWithParentAndChild[];
  endingLat: number;
  endingLon: number;
  onStopReached: (stop: RequestWithParentAndChild) => void;
  onTripCompleted: () => void;
}

export const useCarpoolProximity = ({
  requests,
  endingLat,
  endingLon,
  onStopReached,
  onTripCompleted,
}: UseCarpoolProximityArgs) => {
  useEffect(() => {
    let currentIndex = 0;
    let subscription: Location.LocationSubscription | null = null;

    const monitorNextStop = async () => {
      if (currentIndex < requests.length) {
        const currentStop = requests[currentIndex];
        subscription = await monitorProximity(
          currentStop.startLat,
          currentStop.startLon,
          () => {
            console.log("Reached stop:", currentStop);
            onStopReached(currentStop);
            currentIndex++;
            monitorNextStop();
          }
        );
      } else {
        subscription = await monitorProximity(endingLat, endingLon, () => {
          console.log("Arrived at the final destination!");
          onTripCompleted();
        });
      }
    };

    monitorNextStop();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [requests, endingLat, endingLon, onStopReached, onTripCompleted]);
};

const monitorProximity = async (
  targetLat: number,
  targetLon: number,
  onArrive: () => void
): Promise<Location.LocationSubscription> => {
  const distanceThreshold = 50;

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 1,
    },
    (location) => {
      const { latitude, longitude } = location.coords;

      const distance = haversineDistance(
        { lat: latitude, lon: longitude },
        { lat: targetLat, lon: targetLon }
      );

      if (distance <= distanceThreshold) {
        console.log("User is within 50 meters of the target location!");
        onArrive();
        subscription.remove();
      }
    }
  );

  return subscription;
};

const haversineDistance = (
  coords1: { lat: number; lon: number },
  coords2: { lat: number; lon: number }
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance * 1000;
};
