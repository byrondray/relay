import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { LinearGradient } from "expo-linear-gradient";
import { Button, IndexPath, Popover, Layout } from "@ui-kitten/components";
import ChildSelector from "@/components/carpool/childSelector";
import RideDateTimePicker from "@/components/carpool/dateAndTimePicker";
import TripDescriptionInput from "@/components/carpool/carpoolDescription";
import { useRequestState } from "@/hooks/carpoolRequestState";
import RadioGroupComponent from "@/components/carpool/carpoolFrequency";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { GET_GROUPS } from "@/graphql/group/queries";
import { CREATE_REQUEST } from "@/graphql/carpool/queries";
import { CreateRequestInput, Group } from "@/graphql/generated";
import GroupPicker from "@/components/carpool/groupSelector";
import { auth } from "@/firebaseConfig";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const RequestRide = () => {
  const { currentColors } = useTheme();
  const {
    startingAddress,
    setStartingAddress,
    endingAddress,
    setEndingAddress,
    startingLatLon,
    setStartingLatLon,
    endingLatLon,
    setEndingLatLon,
    selectedIndex,
    setSelectedIndex,
    textColor,
    range,
    setRange,
    showTimePicker,
    setShowTimePicker,
    time,
    setTime,
    visible,
    setVisible,
    description,
    setDescription,
  } = useRequestState();

  const [groups, setGroups] = useState<Group[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<IndexPath>(
    new IndexPath(0)
  );

  const currentUser = auth.currentUser;

  if (!currentUser?.uid) {
    router.replace("/Login/login");
  }

  const { data, loading, error } = useQuery(GET_GROUPS, {
    onCompleted: (data) => {
      if (data) {
        setGroups(data.getGroups);
      }
    },
  });

  const [createRequest] = useMutation<{ createRequest: Request }>(
    CREATE_REQUEST
  );

  const handleTimeConfirm = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    setTime(`${hours}:${minutes}`);
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    try {
      const selectedGroup = groups[selectedGroupIndex.row];
      if (!startingLatLon || !endingLatLon) {
        setErrorMessage("Starting and ending locations must be selected.");
        return;
      }

      const getPickupTimeISO = () => {
        const [hours, minutes] = time.split(":").map(Number);

        const combinedDate = new Date(date);
        combinedDate.setHours(hours, minutes, 0, 0);

        return combinedDate.toISOString();
      };

      const input: CreateRequestInput = {
        parentId: currentUser?.uid!,
        startingAddress,
        endingAddress,
        startingLat: startingLatLon.lat,
        startingLon: startingLatLon.lon,
        endingLat: endingLatLon.lat,
        endingLon: endingLatLon.lon,
        pickupTime: getPickupTimeISO(),
        groupId: selectedGroup?.id,
        childIds: selectedChildren.map((child) => child),
      };

      const { data, errors } = await createRequest({ variables: { input } });

      if (data && data.createRequest) {
        setStartingAddress("");
        setEndingAddress("");
        setStartingLatLon({ lat: 0, lon: 0 });
        setEndingLatLon({ lat: 0, lon: 0 });
        setTime("");
        setDescription("");
        setSelectedChildren([]);
        setSelectedGroupIndex(new IndexPath(0));
        setDate(new Date());
        router.push({
          pathname: "/(tabs)",
          params: { success: "true", type: "request" },
        });
      }

      if (errors) {
        console.error("Error creating request:", errors);
        setErrorMessage("An error occurred while creating the request.");
        setSuccessMessage(null);
        setVisible(true);
        return;
      }

      setErrorMessage(null);

      // setSuccessMessage("A driver has been found! 🎉");
      // setVisible(true);
    } catch (error) {
      console.error("Error creating request:", error);
      setErrorMessage(
        (error as ApolloError).message ||
          "An error occurred while creating the request."
      );
      setSuccessMessage(null);
      setVisible(true);
    }
  };

  const renderSubmitButton = (): React.ReactElement => (
    <Button
      style={{
        width: "100%",
        paddingVertical: 12,
      }}
      appearance="ghost"
      onPress={handleSubmit}
    >
      {() => (
        <Text
          style={{
            color: currentColors.background,
            fontSize: 16,
            fontFamily: "Comfortaa",
          }}
        >
          Submit
        </Text>
      )}
    </Button>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 15,
          backgroundColor: currentColors.background, // Use background color from the theme
          flexGrow: 1,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 32,
              marginBottom: 20,
              fontFamily: "Comfortaa-Bold",
              fontWeight: 700,
              color: currentColors.text,
              letterSpacing: -1,
            }}
          >
            Post a request
          </Text>
        </View>

        <RadioGroupComponent
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: currentColors.text,
              marginBottom: 5,
              fontFamily: "Comfortaa-Regular",
            }}
          >
            From
          </Text>
          <Text
            style={{
              color: currentColors.text,
              marginBottom: 5,
              fontFamily: "Comfortaa-Regular",
            }}
          >
            * Required
          </Text>
        </View>

        <ThemedAddressCompletionInput
          value={startingAddress}
          onChangeText={setStartingAddress}
          onSuggestionSelect={(address) => {
            setStartingAddress(address);
          }}
          onLatLonSelect={(lat, lon) => {
            setStartingLatLon({ lat, lon });
          }}
          placeholder="Enter Origin"
          style={{ marginBottom: 10, fontFamily: "Comfortaa" }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: currentColors.text,
              marginBottom: 5,
              fontFamily: "Comfortaa-Regular",
            }}
          >
            To
          </Text>
          <Text
            style={{
              color: currentColors.text,
              marginBottom: 5,
              fontFamily: "Comfortaa-Regular",
            }}
          >
            * Required
          </Text>
        </View>

        <ThemedAddressCompletionInput
          value={endingAddress}
          onChangeText={setEndingAddress}
          onSuggestionSelect={(address) => {
            setEndingAddress(address);
          }}
          onLatLonSelect={(lat, lon) => {
            setEndingLatLon({ lat, lon });
          }}
          placeholder="Enter Destination"
          style={{ marginBottom: 10 }}
        />

        <RideDateTimePicker
          selectedDate={date}
          handleDateSelect={(date) => setDate(date)}
          selectedTime={time}
          handleTimeSelect={handleTimeConfirm}
          textColor={currentColors.text} // Apply text color from theme
        />

        <Text
          style={{
            color: currentColors.text,
            marginBottom: 10,
            marginTop: 15,
            fontFamily: "Comfortaa-Regular",
          }}
        >
          Select who will join the ride
        </Text>

        <ChildSelector
          onSelectedChildrenChange={(selectedChildren) =>
            setSelectedChildren(selectedChildren)
          }
        />
        <GroupPicker
          groups={groups}
          selectedGroupIndex={selectedGroupIndex}
          setSelectedGroupIndex={setSelectedGroupIndex}
        />

        <TripDescriptionInput
          description={description}
          placeholder="Let drivers know about any special arrangements, e.g., extra car seats or large instruments."
          setDescription={setDescription}
        />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            backgroundColor: currentColors.background,
            marginTop: 40,
          }}
        >
          <LinearGradient
            colors={["#ff8833", "#e24a4a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Button
              style={{
                width: "100%",
                paddingVertical: 12,
              }}
              appearance="ghost"
              onPress={() => {
                handleSubmit();
              }}
            >
              {() => (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontFamily: "Comfortaa",
                  }}
                >
                  Submit
                </Text>
              )}
            </Button>
          </LinearGradient>

          <Popover
            backdropStyle={styles.backdrop}
            visible={visible}
            anchor={() => renderSubmitButton()}
            onBackdropPress={() => setVisible(false)}
            style={{
              marginBottom: 400,
              maxWidth: 330,
              height: 80,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <View>
              <Layout style={styles.content}>
                <Text>
                  {errorMessage ||
                    successMessage ||
                    "There is no driver available. We'll notify you when one is ready 👍"}
                </Text>
              </Layout>
            </View>
          </Popover>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  avatar: {
    marginHorizontal: 4,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default RequestRide;
