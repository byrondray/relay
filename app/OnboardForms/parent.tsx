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
      <Text
        style={[
          styles.heading,
          { fontFamily: "Comfortaa", color: currentColors.text },
        ]}
      >
        Parent Info
      </Text>

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
      <View style={{ marginBottom: 20 }}>
        <ParentFormLabel label="First Name" />
        <ParentFormInput
          placeholder="First Name"
          value={firstName.slice(0, 1).toUpperCase() + firstName.slice(1)}
          onChangeText={setFirstName}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <ParentFormLabel label="Last Name" />
        <ParentFormInput
          placeholder="Last Name"
          // value={lastName.slice(0, 1).toUpperCase() + lastName.slice(1)}
          value="Schatz"
          onChangeText={setLastName}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <ParentFormLabel label="Phone Number" />
        <ParentFormInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <ParentFormLabel label="Email" />
        <ParentFormInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <ParentFormLabel label="Location" />
        <ParentFormInput
          placeholder="City you live in"
          // value={location}
          value={"Burnaby"}
          onChangeText={setLocation}
        />
      </View>

      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <Text
          style={{
            flex: 1,
            flexWrap: "wrap",
            width: "98%",
            fontFamily: "Comfortaa",
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
          style={{ marginTop: -5 }}
        />
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
          disabled={loadingUpdate}
        >
          {loadingUpdate ? (
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
              Next
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
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
    marginBottom: 10,
    fontFamily: "Comfortaa",
  },
});

export default ParentForm;
