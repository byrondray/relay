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

  // Request location permissions
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

  /**
   * Start sharing location
   */
  const shareLocation = async (
    carpoolId: string,
    isLeaving: boolean,
    isFinalDestination: boolean,
    nextStop: { address: string; requestId: string },
    timeToNextStop: string,
    totalTime: string,
    timeUntilNextStop: string,
    onLocationUpdate: (location: {
      latitude: number;
      longitude: number;
    }) => void,
    isSharing: boolean
  ): Promise<void> => {
    if (!permissionGranted) {
      console.error("Location permissions are not granted.");
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000, // 1 second
        distanceInterval: 1, // 1 meter
      },
      (location) => {
        const { latitude, longitude } = location.coords;

        // Invoke the callback with updated location
        if (onLocationUpdate) {
          onLocationUpdate({ latitude, longitude });
        }

        // Send location to the server
        sendLocation({
          variables: {
            carpoolId,
            lat: latitude,
            lon: longitude,
            isLeaving,
            isFinalDestination,
            nextStop,
            timeToNextStop,
            totalTime,
            timeUntilNextStop,
          },
        }).catch((err) => {
          console.error("Error sending location:", err);
        });
      }
    );

    setWatchId(subscription);
  };

  /**
   * Stop sharing location
   */
  const stopSharingLocation = (): void => {
    if (watchId) {
      watchId.remove();
      setWatchId(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        watchId.remove();
      }
    };
  }, [watchId]);

  return {
    shareLocation,
    stopSharingLocation,
    data,
    loading,
    error,
  };
};
