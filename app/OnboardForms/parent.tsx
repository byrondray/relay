import React, { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import ParentFormLabel from "@/components/form/inputLabel";
import ParentFormInput from "@/components/form/inputForm";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER, UPDATE_USER } from "@/graphql/user/queries";
import * as ImagePicker from "expo-image-picker";
import { Toggle } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import ImageUpload from "@/components/carpool/uploadImageInput";
import { useTheme } from "@/contexts/ThemeContext"; // Access the theme

function ParentForm(): JSX.Element {
  const auth = getAuth();
  const { currentColors } = useTheme(); // Access current theme colors
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("6043421096");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [checked, setChecked] = React.useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const {
    data: userData,
    loading: loadingUser,
    error: errorUser,
  } = useQuery(GET_USER, {
    variables: { id: auth.currentUser?.uid },
    onCompleted: (data) => {
      if (data?.getUser) {
        setFirstName(data.getUser.firstName || "");
        setLastName(data.getUser.lastName || "");
        setPhoneNumber(data.getUser.phoneNumber || "");
        setEmail(data.getUser.email || "");
        setLocation(data.getUser.city || "");
      }
    },
    onError: (error) => {
      setErrorMessage("Failed to load user data. Please try again.");
    },
  });

  const [updateUser, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(UPDATE_USER);

  const handleSubmit = async () => {
    if (!firstName || !email) {
      setErrorMessage("First name and email are required");
      return;
    }

    try {
      // await updateUser({
      //   variables: {
      //     id: auth.currentUser?.uid,
      //     firstName,
      //     lastName,
      //     phoneNumber,
      //     email,
      //     city: location,
      //   },
      // });
      router.push("/OnboardForms/child");
    } catch (err) {
      setSubmissionError("Failed to update user info. Please try again.");
    }
  };

  if (loadingUser) {
    return <ActivityIndicator size="large" color={currentColors.tint} />; // Use theme color
  }

  const onCheckedChange = (
    isChecked: boolean | ((prevState: boolean) => boolean)
  ): void => {
    setChecked(isChecked);
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
          <Text style={[styles.subtitle, { color: currentColors.tint }]}>Parent Info</Text>
        </View>

        {errorMessage && (
          <Text
            style={[styles.errorText, { fontFamily: "Comfortaa", color: "red" }]}
          >
            {errorMessage}
          </Text>
        )}

        {submissionError && (
          <Text
            style={[styles.errorText, { fontFamily: "Comfortaa", color: "red" }]}
          >
            {submissionError}
          </Text>
        )}

        <ParentFormLabel label="Profile Image" />
        <ImageUpload profileImage={profileImage} pickImage={pickImage} />
        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="First Name" />
          <ParentFormInput
            placeholder="First Name"
            value={firstName.slice(0, 1).toUpperCase() + firstName.slice(1)}
            onChangeText={setFirstName}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Last Name" />
          <ParentFormInput
            placeholder="Last Name"
            value={lastName.slice(0, 1).toUpperCase() + lastName.slice(1)}
            onChangeText={setLastName}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Phone Number" />
          <ParentFormInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Email" />
          <ParentFormInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginBottom: 22 }}>
          <ParentFormLabel label="Location" />
          <ParentFormInput
            placeholder="City you live in"
            // value={location}
            value={"Burnaby"}
            onChangeText={setLocation}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-start", marginVertical: 10, marginBottom: 40, }}>
          <Text
            style={{
              flex: 1,
              flexWrap: "wrap",
              width: "98%",
              fontFamily: "ComfortaaRegular",
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: -0.2,
              paddingRight: 15,
              color: currentColors.text,
            }}
          >
            If you're a parent interested in becoming a carpool driver to help
            pick up and drop off kids in your community.{" "}
            <Text
              style={{
                color: currentColors.tint,
                textDecorationLine: "none",
                fontFamily: "Comfortaa",
              }}
            >
              Sign up to be a Driver!
            </Text>
          </Text>
          <Toggle
            checked={checked}
            onChange={onCheckedChange}
            style={{}}
          />
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
            disabled={loadingUpdate}
          >
            {loadingUpdate ? (
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
                Next
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

export default ParentForm;
