import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import {
  Radio,
  RadioGroup,
  RangeDatepicker,
  Button,
  Layout,
  Popover,
} from "@ui-kitten/components";
import { TextInput } from "react-native-gesture-handler";
import { TimePickerModal } from "react-native-paper-dates";
import ChildSelector from "@/components/carpool/childSelector";

const RequestRide = () => {
  const [startingAddress, setStartingAddress] = useState("");
  const [endingAddress, setEndingAddress] = useState("");
  const [startingLatLon, setStartingLatLon] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [endingLatLon, setEndingLatLon] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const textColor = useThemeColor({}, "placeholder");
  const [range, setRange] = React.useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");
  const [visible, setVisible] = React.useState(false);

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
            console.log("Selected Address:", address);
          }}
          onLatLonSelect={(lat, lon) => {
            setEndingLatLon({ lat, lon });
          }}
          placeholder="Enter Origin"
          style={{ marginBottom: 10 }}
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
          Seats Occupied
        </Text>
        <ChildSelector
          onSelectedChildrenChange={(selectedChildren) =>
            console.log(selectedChildren)
          }
        />
        <Text style={{ color: textColor, marginBottom: 5, marginTop: 20 }}>
          Description
        </Text>

        <TextInput
          style={{
            width: "100%",
            backgroundColor: "#F7F9FC",
            borderColor: "#E4E9F2",
            borderWidth: 1,
            borderRadius: 15,
            height: 100,
            paddingLeft: 30,
            paddingRight: 30,
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
