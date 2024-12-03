import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ParentFormLabel from "@/components/form/inputLabel";
import ParentFormInput from "@/components/form/inputForm";
import { router } from "expo-router";
import { useMutation, useLazyQuery } from "@apollo/client";
import { FILTER_SCHOOLS_BY_NAME } from "@/graphql/map/queries";
import { CREATE_CHILD } from "@/graphql/user/queries";
import debounce from "lodash.debounce";
import ImageUpload from "@/components/carpool/uploadImageInput";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext"; // Importing ThemeContext

function ChildForm(): JSX.Element {
  const { currentColors } = useTheme(); // Accessing current colors from context
  const [children, setChildren] = useState([
    { firstName: "", lastName: "", school: "", schoolEmail: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [schoolResults, setSchoolResults] = useState<
    { id: string; name: string; city: string }[]
  >([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [createChild] = useMutation(CREATE_CHILD);
  const [filterSchoolsByName, { data: schoolsData }] = useLazyQuery(
    FILTER_SCHOOLS_BY_NAME
  );

  const handleAddKid = () => {
    setChildren([
      ...children,
      {
        firstName: "",
        lastName: "",
        school: "",
        schoolEmail: "",
      },
    ]);
  };

  type ChildField = "firstName" | "lastName" | "school" | "schoolEmail";

  const handleInputChange = (
    index: number,
    field: ChildField,
    value: string
  ) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);

    if (field === "school") {
      handleSearchSchools(value);
    }
  };

  const handleSearchSchools = debounce((value: string) => {
    if (value.length >= 3) {
      setSchoolLoading(true);
      filterSchoolsByName({
        variables: { name: value },
        onCompleted: (data) => {
          setSchoolResults(data?.filterSchoolsByName || []);
          setSchoolLoading(false);
        },
        onError: () => {
          setSchoolLoading(false);
        },
      });
    } else {
      setSchoolResults([]);
    }
  }, 300);

  const handleSchoolSelect = (index: number, schoolName: string) => {
    const updatedChildren = [...children];
    updatedChildren[index]["school"] = schoolName;
    setChildren(updatedChildren);
    setSchoolResults([]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // for (let child of children) {
      //   await createChild({
      //     variables: {
      //       firstName: child.firstName,
      //       schoolName: child.school,
      //       schoolEmailAddress: child.schoolEmail,
      //     },
      //   });
      // }
      router.push("/OnboardForms/vehicle");
    } catch (error) {
      setErrorMessage("Failed to add children. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text
        style={[
          styles.heading,
          { fontFamily: "Comfortaa", color: currentColors.text },
        ]}
      >
        Kid Info
      </Text>

      {errorMessage && (
        <Text style={[styles.errorText, { fontFamily: "Comfortaa" }]}>
          {errorMessage}
        </Text>
      )}
      <ParentFormLabel label="Profile Image" />
      <ImageUpload profileImage={profileImage} pickImage={pickImage} />
      {children.map((child, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <ParentFormLabel label={`Child ${index + 1} - First Name`} />
            <ParentFormInput
              placeholder="First Name"
              // value={child.firstName}
              value={"Anthony"}
              onChangeText={(text) =>
                handleInputChange(index, "firstName", text)
              }
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <ParentFormLabel label="Last Name" />
            <ParentFormInput
              placeholder="Last Name"
              // value={child.lastName}
              value={"Stark"}
              onChangeText={(text) =>
                handleInputChange(index, "lastName", text)
              }
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <ParentFormLabel label="School" />
            <ParentFormInput
              placeholder="School"
              // value={child.school}
              value={"Edmonds Community School"}
              onChangeText={(text) => handleInputChange(index, "school", text)}
            />
            {schoolLoading && (
              <ActivityIndicator size="small" color={currentColors.icon} />
            )}
            {schoolResults.length > 0 && (
              <FlatList
                data={schoolResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSchoolSelect(index, item.name)}
                  >
                    <Text
                      style={[
                        styles.schoolResult,
                        { fontFamily: "Comfortaa", color: currentColors.text },
                      ]}
                    >
                      {item.name} - {item.city}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.schoolResultsList}
              />
            )}
          </View>
          <View style={{ marginBottom: 20 }}>
            <ParentFormLabel label="School Email Address" />
            <ParentFormInput
              placeholder="School Email"
              // value={child.schoolEmail}
              value={"anthony@sd-39.ca"}
              onChangeText={(text) =>
                handleInputChange(index, "schoolEmail", text)
              }
            />
          </View>
        </View>
      ))}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <Text
          style={[{ color: currentColors.text, fontFamily: "Comfortaa" }]}
          onPress={handleAddKid}
        >
          + Add Kid
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
                fontWeight: "semibold",
                fontFamily: "Comfortaa",
              }}
            >
              Next
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
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
  schoolResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  schoolResultsList: {
    maxHeight: 150,
  },
});

export default ChildForm;
