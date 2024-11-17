import { useEffect, useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { SEND_LOCATION } from "@/graphql/map/queries";

export const useSendFakeLocation = () => {
  const [sendLocation, { data, loading, error }] = useMutation(SEND_LOCATION);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isSending = useRef(false);

  const startFakeLocationSharing = (
    carpoolId: string,
    polyline: { latitude: number; longitude: number }[],
    onLocationUpdate: (location: {
      latitude: number;
      longitude: number;
    }) => void,
    interval: number = 1000
  ): void => {
    if (isSending.current) {
      console.warn("Fake location sharing is already in progress.");
      return;
    }

    let index = 0;
    isSending.current = true;

    const id = setInterval(() => {
      if (index >= polyline.length) {
        stopFakeLocationSharing();
        return;
      }

      const currentLocation = polyline[index];
      onLocationUpdate(currentLocation);

      sendLocation({
        variables: {
          carpoolId,
          lat: currentLocation.latitude,
          lon: currentLocation.longitude,
        },
      });

      index++;
    }, interval);

    setIntervalId(id);
  };

  const stopFakeLocationSharing = (): void => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    isSending.current = false;
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    startFakeLocationSharing,
    stopFakeLocationSharing,
    data,
    loading,
    error,
  };
};
