import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import {
  Radio,
  RadioGroup,
  RangeDatepicker,
  Button,
} from "@ui-kitten/components";
import { TextInput } from "react-native-gesture-handler";
import { TimePickerModal } from "react-native-paper-dates";
import ChildSelector from "@/components/carpool/childSelector";

const RequestRide = () => {
  const [origin, setOrigin] = useState("");
  const [startingAddress, setStartingAddress] = useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const textColor = useThemeColor({}, "placeholder");
  const [range, setRange] = React.useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");

  console.log("Range:", range);

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
            Post a ride
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <RadioGroup
            selectedIndex={selectedIndex}
            onChange={(index) => setSelectedIndex(index)}
            style={{ flexDirection: "row", width: "100%" }}
          >
            <Radio style={{ marginRight: 10 }}>One time</Radio>
            <Radio>Recurring</Radio>
          </RadioGroup>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: textColor, marginBottom: 5 }}>From</Text>
          <Text style={{ color: textColor, marginBottom: 5 }}>* Required</Text>
        </View>

        <ThemedAddressCompletionInput
          value={origin}
          onChangeText={setStartingAddress}
          onSuggestionSelect={(address) => {
            console.log("Selected Address:", address);
          }}
          onLatLonSelect={(lat, lon) => {}}
          placeholder="Enter Origin"
          style={{ marginBottom: 20 }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: textColor, marginBottom: 5 }}>To</Text>
          <Text style={{ color: textColor, marginBottom: 5 }}>* Required</Text>
        </View>
        <ThemedAddressCompletionInput
          value={origin}
          onChangeText={setStartingAddress}
          onSuggestionSelect={(address) => {
            console.log("Selected Address:", address);
          }}
          onLatLonSelect={(lat, lon) => {}}
          placeholder="Enter Origin"
          style={{ marginBottom: 20 }}
        />
        <Text style={{ marginBottom: 5, marginTop: 15, color: "#8F9BB3" }}>
          Date Range of Ride
        </Text>
        <View
          style={{
            backgroundColor: "#F7F9FC",
            height: 43,
            borderColor: "#E4E9F2",
            borderWidth: 1,
            borderRadius: 15,
            paddingLeft: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={require("../../../assets/images/calendar-icon.png")}
            style={{ marginLeft: 10 }}
          />
          <RangeDatepicker
            range={range}
            onSelect={(nextRange) => setRange(nextRange)}
          />
        </View>
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <View
            style={{
              backgroundColor: "#F7F9FC",
              height: 43,
              borderColor: "#E4E9F2",
              borderWidth: 1,
              borderRadius: 15,
              paddingLeft: 25,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <Image
              source={require("../../../assets/images/calendar-icon.png")}
              style={{ marginTop: 2 }}
            />
            <Text style={{ marginLeft: 15, color: textColor, marginRight: 25 }}>
              {time ? time : "Select Date & Time"}
            </Text>
          </View>
        </TouchableOpacity>

        <TimePickerModal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={handleTimeConfirm}
          hours={12}
          minutes={0}
        />
        <Text style={{ color: textColor, marginBottom: 10, marginTop: 15 }}>
          Seats Required
        </Text>
        <ChildSelector />
        <Text style={{ color: textColor, marginBottom: 5, marginTop: 20 }}>
          Description
        </Text>
        <TextInput
          style={{
            width: "100%",
            backgroundColor: "#F7F9FC",
            borderColor: "#E4E9F2",
            height: 100,
            paddingLeft: 10,
          }}
          placeholder="Tell drivers more about any special arrangement, e.g. extra car seat, large instrument"
          multiline={true}
        ></TextInput>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            backgroundColor: "#fff",
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
              onPress={() => console.log("Button pressed")}
            >
              {() => (
                <Text style={{ color: "#fff", fontSize: 16 }}>Submit</Text>
              )}
            </Button>
          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RequestRide;
