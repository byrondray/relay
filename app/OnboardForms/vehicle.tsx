import React, { useState } from "react";
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
import { ScrollView } from "react-native-gesture-handler";
import ImageUpload from "@/components/carpool/uploadImageInput";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "@ui-kitten/components";
import { useTheme } from "@/contexts/ThemeContext";

function VehicleForm(): JSX.Element {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const { currentColors } = useTheme(); // Accessing current colors from the theme context

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [insuranceImage, setInsuranceImage] = useState<string | null>(null);
  const [checked, setChecked] = React.useState(false);

  // const {
  //   data: vehicleData,
  //   loading: vehicleLoading,
  //   error: vehicleError,
  // } = useQuery(GET_VEHICLE_FOR_USER, {
  //   variables: { userId },
  //   skip: !userId,
  //   onCompleted: (data) => {
  //     if (data?.getVehicleForUser) {
  //       const vehicle = data.getVehicleForUser;
  //       setMake(vehicle.make || "");
  //       setModel(vehicle.model || "");
  //       setYear(vehicle.year || "");
  //       setNumberOfSeats(vehicle.numberOfSeats || "");
  //       setLicensePlate(vehicle.licensePlate || "");
  //       setColor(vehicle.color || "");
  //     }
  //   },
  // });

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
      router.push({
        pathname: "/(tabs)",
        params: {
          hasOnboarded: "true",
        },
      });
    } catch (error) {
      setErrorMessage("Failed to submit vehicle info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // if (vehicleLoading) {
  //   return <ActivityIndicator size="large" color={currentColors.tint} />;
  // }

  // if (vehicleError) {
  //   return (
  //     <Text style={[styles.errorText, { fontFamily: "Comfortaa" }]}>
  //       Error loading vehicle data.
  //     </Text>
  //   );
  // }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setInsuranceImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView>
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Text
          style={[
            styles.heading,
            { color: currentColors.text, fontFamily: "Comfortaa" },
          ]}
        >
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
            placeholder="e.g. BMW"
            value={make}
            onChangeText={setMake}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Model" />
          <ParentFormInput
            placeholder="e.g. X3"
            value={model}
            onChangeText={setModel}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Year" />
          <ParentFormInput
            placeholder="e.g. 2020"
            value={year}
            onChangeText={setYear}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="License Plate" />
          <ParentFormInput
            placeholder="License Plate"
            value={licensePlate}
            onChangeText={setLicensePlate}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Vehicle Color" />
          <ParentFormInput
            placeholder="Vehicle Color"
            value={color}
            onChangeText={setColor}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Passenger Seat(s) available" />
          <ParentFormInput
            placeholder="Vehicle Seats"
            value={color}
            onChangeText={setNumberOfSeats}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ParentFormLabel label="Driver’s License " />
          <TouchableOpacity>
            <View
              style={[
                styles.imageUploadContainer,
                { backgroundColor: currentColors.background },
              ]}
            >
              <Text
                style={{
                  color: currentColors.text,
                  fontFamily: "Comfortaa",
                  marginTop: 5,
                }}
              >
                Press here to upload photo of insurance details
              </Text>
              <ImageUpload
                profileImage={insuranceImage}
                pickImage={pickImage}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 10 }}>
          <ParentFormLabel label="Vehicle Insurance Proof" />
          <TouchableOpacity>
            <View
              style={[
                styles.imageUploadContainer,
                { backgroundColor: currentColors.background },
              ]}
            >
              <ImageUpload
                profileImage={insuranceImage}
                pickImage={pickImage}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 80,
          }}
        >
          <CheckBox
            checked={checked}
            onChange={(nextChecked) => setChecked(nextChecked)}
          />
          <Text
            style={{
              fontSize: 12,
              color: currentColors.text,
              marginLeft: 8,
              fontFamily: "Comfortaa",
            }}
          >
            By checking this box, you agree to our Terms and Conditions and
            acknowledge that you have read and understood the Carpool Agreement.
          </Text>
        </View>

        <LinearGradient
          colors={["#ff8833", "#e24a4a"]}
          style={{ width: "100%", borderRadius: 50 }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={currentColors.text} />
            ) : (
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 20,
                  fontFamily: "Comfortaa-semibold",
                }}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
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
    fontFamily: "Comfortaa",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Comfortaa",
  },
  imageUploadContainer: {
    backgroundColor: "#F7F9FC",
    width: "100%",
    borderRadius: 15,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E4E9F2",
    marginTop: 15,
  },
});

export default VehicleForm;
