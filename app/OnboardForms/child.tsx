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

function ChildForm(): JSX.Element {
  const [children, setChildren] = useState([
    { firstName: "", lastName: "", school: "", schoolEmail: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [schoolResults, setSchoolResults] = useState<
    { id: string; name: string; city: string }[]
  >([]);

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
      for (let child of children) {
        // await createChild({
        //   variables: {
        //     firstName: child.firstName,
        //     schoolName: child.school,
        //     schoolEmailAddress: child.schoolEmail,
        //   },
        // });
      }
      router.push("/OnboardForms/vehicle");
    } catch (error) {
      setErrorMessage("Failed to add children. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.heading}>Kid Info</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {children.map((child, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <ParentFormLabel label={`Child ${index + 1} - First Name`} />
            <ParentFormInput
              placeholder="First Name"
              value={"Jack"}
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
              value={"Holland"}
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
              <ActivityIndicator size="small" color="#0000ff" />
            )}
            {schoolResults.length > 0 && (
              <FlatList
                data={schoolResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSchoolSelect(index, item.name)}
                  >
                    <Text style={styles.schoolResult}>
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
              value={"jholland@sd41.com"}
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
        <Text style={{ color: "#8F9BB3" }} onPress={handleAddKid}>
          + Add Kid
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 40,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: loading ? "#cccccc" : "#FF8833",
            padding: 10,
            borderRadius: 50,
            marginRight: 10,
            width: 100,
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
              }}
            >
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
