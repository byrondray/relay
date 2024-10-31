import React from "react";
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
import { Button, Layout, Popover } from "@ui-kitten/components";
import ChildSelector from "@/components/carpool/childSelector";
import RideDateTimePicker from "@/components/carpool/dateAndTimePicker";
import TripDescriptionInput from "@/components/carpool/carpoolDescription";
import { useRequestState } from "@/hooks/carpoolRequestState";
import RadioGroupComponent from "@/components/carpool/carpoolFrequency";

const RequestRide = () => {
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

  const handleModelSubmit = () => {
    setVisible(true);
  };

  const renderToggleButton = (): React.ReactElement => (
    <Button
      style={{
        width: "100%",
        paddingVertical: 12,
      }}
      appearance="ghost"
      onPress={handleModelSubmit}
    >
      {() => <Text style={{ color: "#fff", fontSize: 16 }}>Submit</Text>}
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
          backgroundColor: "#ffffff",
          flexGrow: 1,
        }}
      >
        <View>
          <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
            Post a request
          </Text>
        </View>

        <RadioGroupComponent
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: textColor, marginBottom: 5 }}>From</Text>
          <Text style={{ color: textColor, marginBottom: 5 }}>* Required</Text>
        </View>

        <ThemedAddressCompletionInput
          value={startingAddress}
          onChangeText={setStartingAddress}
          onSuggestionSelect={(address) => {
            setStartingAddress(address);
            console.log("Selected Address:", address);
          }}
          onLatLonSelect={(lat, lon) => {
            setStartingLatLon({ lat, lon });
          }}
          placeholder="Enter Origin"
          style={{ marginBottom: 10 }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: textColor, marginBottom: 5 }}>To</Text>
          <Text style={{ color: textColor, marginBottom: 5 }}>* Required</Text>
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
          placeholder="Enter Origin"
          style={{ marginBottom: 10 }}
        />
        <RideDateTimePicker
          selectedDate={new Date()}
          handleDateSelect={(date) => console.log(date)}
          selectedTime={time}
          handleTimeSelect={handleTimeConfirm}
          textColor={textColor}
        />
        <Text style={{ color: textColor, marginBottom: 10, marginTop: 15 }}>
          Seats Occupied
        </Text>
        <ChildSelector
          onSelectedChildrenChange={(selectedChildren) =>
            console.log(selectedChildren)
          }
        />
        <TripDescriptionInput
          textColor={textColor}
          description={description}
          setDescription={setDescription}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            backgroundColor: "#fff",
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
            {renderToggleButton()}
          </LinearGradient>
          <Popover
            backdropStyle={styles.backdrop}
            visible={visible}
            anchor={() => renderToggleButton()}
            onBackdropPress={() => setVisible(false)}
            style={{
              marginBottom: 400,
              maxWidth: 300,
              height: 100,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Layout style={styles.content}>
              <Text>
                There is no driver avaliable, we'll send you a notification when
                one is ready👍
              </Text>
            </Layout>
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
