import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSendLocation } from "@/hooks/map/useShareLocation";

interface ShareLocationButtonProps {
  carpoolId: string;
  nextStop: { address: string; requestId: string };
  timeToNextStop: string;
  totalTime: string;
  timeUntilNextStop: string;
  isLeaving: boolean;
  isFinalDestination: boolean;
  onLocationUpdate: (
    location: { latitude: number; longitude: number } | null
  ) => void;
}

const ShareLocationButton: React.FC<ShareLocationButtonProps> = ({
  carpoolId,
  nextStop,
  timeToNextStop,
  totalTime,
  timeUntilNextStop,
  isLeaving,
  isFinalDestination,
  onLocationUpdate,
}) => {
  const { shareLocation, stopSharingLocation, loading } = useSendLocation();
  const [isSharing, setIsSharing] = useState(false);

  const toggleLocationSharing = () => {
    if (isSharing) {
      stopSharingLocation();
      onLocationUpdate(null);
    } else {
      shareLocation(
        carpoolId,
        isLeaving,
        isFinalDestination,
        nextStop,
        timeToNextStop,
        totalTime,
        timeUntilNextStop,
        (location) => {
          onLocationUpdate(location);
        },
        isSharing
      );
    }
    setIsSharing(!isSharing);
  };

  return (
    <LinearGradient
      colors={["#e24a4a", "#ff8833"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        width: "100%",
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 15,
      }}
    >
      <TouchableOpacity onPress={toggleLocationSharing} disabled={loading}>
        <View style={{ padding: 10, alignItems: "center" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Comfortaa",
            }}
          >
            {loading
              ? "Processing..."
              : isSharing
              ? "Stop Sharing Location"
              : "Start Sharing Location"}
          </Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ShareLocationButton;
