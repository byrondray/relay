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
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <LinearGradient
        colors={[currentColors.gradient[0], currentColors.gradient[1]]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // Diagonal gradient
      >
        <View style={{ marginTop: 10, }}>
          <Text
            style={[
              styles.heading,
              { color: currentColors.text },
            ]}
          >
            Sign Up
          </Text>
          <View style={{ height: 1, backgroundColor: currentColors.tint, marginBottom: 20, }}></View>
          <Text style={[styles.subtitle, { color: currentColors.tint }]}>Vehicle Information</Text>
        </View>

        {errorMessage && (
          <Text style={[styles.errorText, { fontFamily: "Comfortaa" }]}>
            {errorMessage}
          </Text>
        )}

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Make" />
          <ParentFormInput
            placeholder="e.g. BMW"
            // value={make}
            value={"Toyota"}
            onChangeText={setMake}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Model" />
          <ParentFormInput
            placeholder="e.g. X3"
            // value={model}
            value={"Corolla"}
            onChangeText={setModel}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Year" />
          <ParentFormInput
            placeholder="e.g. 2020"
            // value={year}
            value={"2022"}
            onChangeText={setYear}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="License Plate" />
          <ParentFormInput
            placeholder="License Plate"
            // value={licensePlate}
            value={"ABC123"}
            onChangeText={setLicensePlate}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Vehicle Color" />
          <ParentFormInput
            placeholder="Vehicle Color"
            // value={color}
            value={"Black"}
            onChangeText={setColor}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Passenger Seat(s) available" />
          <ParentFormInput
            placeholder="Vehicle Seats"
            // value={color}
            value={"4"}
            onChangeText={setNumberOfSeats}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel 
            label="Driver's License" 
            styleAdd={{ marginBottom: 15, }}
          />
          <Text
            style={{
              marginBottom: 12,
              marginLeft: 5,
              fontSize: 12,
              fontFamily: "ComfortaaRegular",
              color: currentColors.text,
            }}
          >
            Press here to upload photo of insurance details
          </Text>
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


        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Vehicle Insurance Proof" styleAdd={{ marginBottom: 10, }} />
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
            marginBottom: 40,
          }}
        >
          <CheckBox
            checked={checked}
            onChange={(nextChecked) => setChecked(nextChecked)}
          />
          <Text
            style={{
              flex: 1,
              flexWrap: "wrap",
              width: "98%",
              fontFamily: "ComfortaaRegular",
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: -0.2,
              paddingLeft: 15,
              color: currentColors.text,
            }}
          >
            By checking this box, you agree to our Terms and Conditions and acknowledge that you have read and understood the Carpool Agreement.
          </Text>
        </View>

        <LinearGradient
          colors={["#ff8833", "#e24a4a"]}
          style={{ width: "100%", height: 44, marginTop: 20, borderRadius: 50, }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
                  fontSize: 16,
                  fontFamily: "Comfortaa-semibold",
                }}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
        <View style={{ marginBottom: 60 }} />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 200,
  },
  heading: {
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "ComfortaaBold",
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 5,
    marginBottom: 25,
    fontFamily: "ComfortaaBold",
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  imageUploadContainer: {
    backgroundColor: "#F7F9FC",
    width: "100%",
    borderRadius: 15,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E4E9F2",
    marginTop: 15,
  },
  errorText: {
    marginBottom: 10,
    fontFamily: "ComfortaaRegular",
    letterSpacing: -0.3,
  },
  gradientBackground: {
    paddingHorizontal: 16,
    flex: 1,
  },
});

export default VehicleForm;
