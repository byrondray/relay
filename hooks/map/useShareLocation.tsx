import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_LOCATION } from "@/graphql/map/queries";

export const useSendLocation = () => {
  const [sendLocation, { data, loading, error }] = useMutation(SEND_LOCATION);

  const [watchId, setWatchId] = useState<number | null>(null);

  interface ShareLocationVariables {
    carpoolId: string;
    lat: number;
    lon: number;
  }

  interface ShareLocationResult {
    shareLocation: (carpoolId: string) => void;
    stopSharingLocation: () => void;
    data: any;
    loading: boolean;
    error: any;
  }

  const shareLocation = (carpoolId: string): void => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocation({
          variables: {
            carpoolId,
            lat: latitude,
            lon: longitude,
          },
        });
      },
      (error) => {
        console.error("Error watching location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      }
    );

    setWatchId(watchId);
  };

  const stopSharingLocation = (): void => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { shareLocation, stopSharingLocation, data, loading, error };
};
