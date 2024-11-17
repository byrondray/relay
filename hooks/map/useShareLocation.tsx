import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import * as Location from "expo-location";
import { SEND_LOCATION } from "@/graphql/map/queries";

export const useSendLocation = () => {
  const [sendLocation, { data, loading, error }] = useMutation(SEND_LOCATION);
  const [watchId, setWatchId] = useState<Location.LocationSubscription | null>(
    null
  );
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
      } else {
        console.error("Location permissions not granted");
      }
    };

    requestPermissions();
  }, []);

  const shareLocation = async (
    carpoolId: string,
    onLocationUpdate: (location: {
      latitude: number;
      longitude: number;
    }) => void
  ): Promise<void> => {
    if (!permissionGranted) {
      console.error("Location permissions are not granted.");
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        onLocationUpdate({ latitude, longitude });
        sendLocation({
          variables: {
            carpoolId,
            lat: latitude,
            lon: longitude,
          },
        });
      }
    );

    setWatchId(subscription);
  };

  const stopSharingLocation = (): void => {
    if (watchId) {
      watchId.remove();
      setWatchId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        watchId.remove();
      }
    };
  }, [watchId]);

  return { shareLocation, stopSharingLocation, data, loading, error };
};
