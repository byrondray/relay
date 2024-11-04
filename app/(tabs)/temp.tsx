import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  Touchable,
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
import { TouchableOpacity } from "react-native-gesture-handler";
import { processFontFamily } from "expo-font";
import { auth } from "@/firebaseConfig";

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { fontFamily: "Comfortaa" }]}>
        New Ride
      </Text>
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Carpool/createRide")}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F7F9FC",
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 30,
              borderColor: "#E4E9F2",
              borderWidth: 1,
              height: 100,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  fontWeight: "semibold",
                  marginBottom: 3,
                }}
              >
                I'm a driver
              </Text>
              <Text style={{ color: "#8F9BB3", fontSize: 16 }}>
                I'm available to carpool other kids.
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: "#222B45",
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
            style={{
              flexDirection: "row",
              backgroundColor: "#F7F9FC",
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 30,
              borderColor: "#E4E9F2",
              borderWidth: 1,
              height: 100,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  fontWeight: "semibold",
                  marginBottom: 3,
                }}
              >
                Looking for a ride for my kid
              </Text>
              <Text style={{ color: "#8F9BB3", fontSize: 16 }}>
                Notify me when a ride matches
              </Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={{
                width: 40,
                height: 40,
                tintColor: "#222B45",
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
    backgroundColor: "#fff",
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
});
