import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import ParentFormLabel from "@/components/form/inputLabel";
import ParentFormInput from "@/components/form/inputForm";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER, UPDATE_USER } from "@/graphql/queries";

function ParentForm(): JSX.Element {
  const auth = getAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
      await updateUser({
        variables: {
          id: auth.currentUser?.uid,
          firstName,
          lastName,
          phoneNumber,
          email,
          city: location,
        },
      });
      router.push("/OnboardForms/child");
    } catch (err) {
      setSubmissionError("Failed to update user info. Please try again.");
    }
  };

  if (loadingUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: "#ffffff" }]}>
      <Text style={styles.heading}>Parent Info</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {submissionError && (
        <Text style={styles.errorText}>{submissionError}</Text>
      )}

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
          value={lastName.slice(0, 1).toUpperCase() + lastName.slice(1)}
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

      <View style={{ marginBottom: 40 }}>
        <ParentFormLabel label="Location" />
        <ParentFormInput
          placeholder="City you live in"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View
        style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: loadingUpdate ? "#cccccc" : "#FF8833",
            padding: 10,
            borderRadius: 50,
            marginRight: 10,
            width: 100,
          }}
          onPress={handleSubmit}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 20,
                fontWeight: "semibold",
              }}
            >
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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

export default ParentForm;
