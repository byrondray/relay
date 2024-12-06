import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
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
    <ScrollView
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      <LinearGradient
        colors={[currentColors.gradient[0], currentColors.gradient[1]]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // Diagonal gradient
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <Text style={[styles.subtitle, { color: currentColors.tint }]}>Kid Info</Text>
          </View>

          {errorMessage && (
            <Text style={[styles.errorText, { fontFamily: "Comfortaa" }]}>
              {errorMessage}
            </Text>
          )}
          <ParentFormLabel label="Profile Image" />
          <ImageUpload profileImage={profileImage} pickImage={pickImage} />
          {children.map((child, index) => (
            <View key={index} style={{ marginBottom: 22 }}>
              <View style={{ marginBottom: 22 }}>
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

              <View style={{ marginBottom: 22 }}>
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
              <View style={{ marginBottom: 22 }}>
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
              <View style={{ marginBottom: 22 }}>
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
              marginBottom: 22,
            }}
          >
            <Text
              style={[{ color: currentColors.text, fontFamily: "ComfortaaBold", marginBottom: 40, }]}
              onPress={handleAddKid}
            >
              + Add Kid
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
                  Next
                </Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
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
  gradientBackground: {
    paddingHorizontal: 16,
    flex: 1,
  },
});

export default ChildForm;
