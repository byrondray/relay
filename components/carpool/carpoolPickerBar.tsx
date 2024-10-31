import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CarpoolPickerBar = ({}) => {
  return (
    <LinearGradient
      colors={["#FF8834", "#E44D4A"]}
      style={{
        width: "100%",
        height: 35,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        opacity: 0.7,
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
          }}
        >
          START
        </Text>
      </View>

      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 20,
          backgroundColor: "#1C1C1E",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          1
        </Text>
      </View>

      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 20,
          backgroundColor: "#1C1C1E",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          2
        </Text>
      </View>

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
          }}
        >
          END
        </Text>
      </View>
    </LinearGradient>
  );
};

export default CarpoolPickerBar;
