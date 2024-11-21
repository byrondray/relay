import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import withAuthCheck from "../../components/WithAuthCheck";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocationAndCommunityCenters } from "@/hooks/map/useMap";
import { useDirections } from "@/hooks/map/useDirections";
import { CommunityCenter } from "@/graphql/generated";
import { useLogout } from "@/hooks/auth/useLogout";
import Reload from "@/assets/images/reload.svg";
import { useQuery } from "@apollo/client";
import { HAS_USER_ON_BOARDED } from "@/graphql/user/queries";
import { router, Href } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_CHILDREN_FOR_USER } from "@/graphql/user/queries";
import { auth } from "@/firebaseConfig";
import { useTheme } from "@/contexts/ThemeContext";  // Importing ThemeContext
// import { useTextSize } from "@/contexts/TextSizeContext";

function HomeScreen() {
  const { currentColors } = useTheme();  // Accessing current colors from context
  // const { isLargeText, textScaleFactor } = useTextSize();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.heading, { color: currentColors.text }]}>New Ride</Text>
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Carpool/createRide")}
        >
          <View
            style={[
              styles.buttonContainer,
              { backgroundColor: currentColors.background, borderColor: currentColors.tint },
            ]}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text style={[
                styles.buttonText, 
                { 
                  color: currentColors.text, 
                  fontSize: 20
                }]}>
                I'm a driver
              </Text>
              <Text style={[styles.subText, { color: currentColors.text }]}>
                I'm available to carpool other kids.
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: currentColors.icon,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Carpool/postRequest" as Href)}
        >
          <View
            style={[
              styles.buttonContainer,
              { backgroundColor: currentColors.background, borderColor: currentColors.tint },
            ]}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text style={[styles.buttonText, { color: currentColors.text }]}>
                Looking for a ride for my kid
              </Text>
              <Text style={[styles.subText, { color: currentColors.text }]}>
                Notify me when a ride matches
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: currentColors.icon,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default withAuthCheck(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  predictedTimeContainer: {
    padding: 8,
    marginVertical: 8,
  },
  map: {
    flex: 1,
    width: "100%",
    height: 400,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderWidth: 1,
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "semibold",
    marginBottom: 3,
  },
  subText: {
    fontSize: 16,
  },
});
