import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSendFakeLocation } from "@/hooks/map/useSendFakeLocation";

interface ShareFakeLocationButtonProps {
  carpoolId: string;
  nextStop: { address: string; requestId: string };
  timeToNextStop: string;
  totalTime: string;
  timeUntilNextStop: string;
  isLeaving: boolean;
  isFinalDestination: boolean;
  polyline: { latitude: number; longitude: number }[];
  onLocationUpdate: (
    location: { latitude: number; longitude: number } | null
  ) => void;
}

const ShareFakeLocationButton: React.FC<ShareFakeLocationButtonProps> = ({
  carpoolId,
  nextStop,
  timeToNextStop,
  totalTime,
  timeUntilNextStop,
  isLeaving,
  isFinalDestination,
  polyline,
  onLocationUpdate,
}) => {
  const { startFakeLocationSharing, stopFakeLocationSharing, loading } =
    useSendFakeLocation();
  const [isSharing, setIsSharing] = useState(false);

  const toggleFakeLocationSharing = () => {
    if (isSharing) {
      stopFakeLocationSharing();
      onLocationUpdate(null);
    } else {
      startFakeLocationSharing(
        carpoolId,
        polyline,
        nextStop,
        timeToNextStop,
        totalTime,
        timeUntilNextStop,
        isLeaving,
        isFinalDestination,
        (location: { latitude: number; longitude: number }) => {
          onLocationUpdate(location);
        },
        1000
      ); // Fixed interval
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
      <TouchableOpacity onPress={toggleFakeLocationSharing} disabled={loading}>
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

export default ShareFakeLocationButton;
