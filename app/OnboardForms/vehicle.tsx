import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ParentFormLabel from "@/components/form/inputLabel";
import ParentFormInput from "@/components/form/inputForm";
import { Href, router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_VEHICLE, GET_VEHICLE_FOR_USER } from "@/graphql/user/queries";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

function VehicleForm(): JSX.Element {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: vehicleData,
    loading: vehicleLoading,
    error: vehicleError,
  } = useQuery(GET_VEHICLE_FOR_USER, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.getVehicleForUser) {
        const vehicle = data.getVehicleForUser;
        setMake(vehicle.make || "");
        setModel(vehicle.model || "");
        setYear(vehicle.year || "");
        setNumberOfSeats(vehicle.numberOfSeats || "");
        setLicensePlate(vehicle.licensePlate || "");
        setColor(vehicle.color || "");
      }
    },
  });

  const [createVehicle] = useMutation(CREATE_VEHICLE);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // await createVehicle({
      //   variables: {
      //     make,
      //     model,
      //     year,
      //     licensePlate,
      //     color,
      //     numberOfSeats
      //   },
      // });
      // await AsyncStorage.setItem("hasOnboarded", "true");
      router.push("/(tabs)/temp" as Href);
    } catch (error) {
      setErrorMessage("Failed to submit vehicle info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (vehicleLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (vehicleError) {
    return (
      <Text style={[styles.errorText, { fontFamily: "Comfortaa" }]}>
        Error loading vehicle data.
      </Text>
    );
  }

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
        <Text style={[styles.heading, { fontFamily: "Comfortaa" }]}>
          Vehicle Information
        </Text>

        {errorMessage && (
          <Text style={[styles.errorText, { fontFamily: "Comfortaa" }]}>
            {errorMessage}
          </Text>
        )}

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Make" />
          <ParentFormInput
            placeholder="Make"
            // value={make}
            value={"Toyota"}
            onChangeText={setMake}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Model" />
          <ParentFormInput
            placeholder="Model"
            // value={model}
            value={"Camry"}
            onChangeText={setModel}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Year" />
          <ParentFormInput
            placeholder="Year"
            // value={year}
            value={"2020"}
            onChangeText={setYear}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="License Plate" />
          <ParentFormInput
            placeholder="License Plate"
            // value={licensePlate}
            value={"KP875G"}
            onChangeText={setLicensePlate}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Vehicle Color" />
          <ParentFormInput
            placeholder="Vehicle Color"
            // value={color}
            value={"Red"}
            onChangeText={setColor}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Vehicle Seats" />
          <ParentFormInput
            placeholder="Vehicle Seats"
            // value={color}
            value={"4"}
            onChangeText={setNumberOfSeats}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Insurance Details" />
          <TouchableOpacity>
            <View
              style={{
                backgroundColor: "#F7F9FC",
                width: "100%",
                borderRadius: 15,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#E4E9F2",
              }}
            >
              <Text style={{ color: "#8F9BB3", fontFamily: "Comfortaa" }}>
                Press here to upload photo of insurance details
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: loading ? "#cccccc" : "#FF8833",
              padding: 10,
              borderRadius: 50,
              marginRight: 10,
              width: 100,
              height: 50,
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "semibold",
                  fontFamily: "Comfortaa",
                }}
              >
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default VehicleForm;
