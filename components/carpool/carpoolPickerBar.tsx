import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RequestWithChildrenAndParent } from "@/graphql/generated";

const CarpoolPickerBar = ({
  selectedWaypoints,
  sortedRequests,
}: {
  selectedWaypoints: RequestWithChildrenAndParent[];
  sortedRequests: RequestWithChildrenAndParent[];
}) => {
  const sortedSelectedWaypoints = sortedRequests
    .map((request, index) => ({
      request,
      index: index + 1, 
    }))
    .filter(({ request }) =>
      selectedWaypoints.some((wp) => wp.id === request.id)
    );

  return (
    <LinearGradient
      colors={["rgba(255, 136, 52, 0.7)", "rgba(228, 77, 74, 0.7)"]} // Updated colors with opacity
      style={{
        width: "100%",
        height: 35,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View
        style={{
          width: 60,
          height: 25,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: "#FF6A00",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 12,
            fontFamily: "Comfortaa",
          }}
        >
          START
        </Text>
      </View>

      {sortedSelectedWaypoints.map(({ request, index }) => (
        <View
          key={request.id}
          style={{
            width: 25,
            height: 25,
            borderRadius: 20,
            backgroundColor: "#1C1C1E", // Full opacity background color
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: "Comfortaa",
            }}
          >
            {index}
          </Text>
        </View>
      ))}

      <View
        style={{
          width: 60,
          height: 25,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: "#DE4141",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 12,
            fontFamily: "Comfortaa",
          }}
        >
          END
        </Text>
      </View>
    </LinearGradient>
  );
};

export default CarpoolPickerBar;
