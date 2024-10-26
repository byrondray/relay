import React, { useEffect, useState } from "react";
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
import MapView from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import {
  CheckBox,
  Datepicker,
  IndexPath,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { TextInput } from "react-native-gesture-handler";
import { TimePickerModal } from "react-native-paper-dates";
import ChildSelector from "@/components/carpool/childSelector";
import {
  GET_CARPOOLERS_WITHOUT_APPROVED_REQUESTS,
  GET_VEHICLE_FOR_USER,
} from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { auth } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { Request } from "@/graphql/generated";

const CreateRide = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startingLatLng, setStartingLatLng] = useState({ lat: 0, lon: 0 });
  const [endingLatLng, setEndingLatLng] = useState({ lat: 0, lon: 0 });
  const [startingAddress, setStartingAddress] = useState("");
  const [endingAddress, setEndingAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateAndTime, setDateAndTime] = useState("Select Date & Time");
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(
    new IndexPath(0)
  );
  const [selectedSeatsIndex, setSelectedSeatsIndex] = useState(
    new IndexPath(0)
  );
  const [extraCarseatChecked, setExtraCarseatChecked] = useState(false);
  const [winterTiresChecked, setWinterTiresChecked] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const groupId = useLocalSearchParams().groupId;
  const user = auth.currentUser;
  const userId = user?.uid;

  console.log(vehicles, "vehicles");

  const {
    data: getCarpoolersWithoutApprovedRequests,
    loading,
    error,
  } = useQuery(GET_CARPOOLERS_WITHOUT_APPROVED_REQUESTS, {
    variables: {
      groupId,
      dateAndTime,
      time,
      endingAddress,
    },
    skip: !groupId || !dateAndTime || !time || !endingAddress,
    onCompleted: (data) => {
      if (data?.getCarpoolersByGroupWithoutApprovedRequests) {
        setRequests(data.getCarpoolersByGroupWithoutApprovedRequests);
      }
    },
  });

  const { data: getVehicleForUser } = useQuery(GET_VEHICLE_FOR_USER, {
    variables: {
      userId,
    },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.getVehicleForUser) {
        setVehicles(data.getVehicleForUser);
      }
    },
  });

  useEffect(() => {
    if (getCarpoolersWithoutApprovedRequests && !loading && !error) {
      setRequests(
        getCarpoolersWithoutApprovedRequests.getCarpoolersByGroupWithoutApprovedRequests
      );
    }
  }, [getCarpoolersWithoutApprovedRequests, loading, error]);

  useEffect(() => {
    if (getCarpoolersWithoutApprovedRequests && !loading && !error) {
      setRequests(
        getCarpoolersWithoutApprovedRequests.getCarpoolersByGroupWithoutApprovedRequests
      );
    }
  }, [getCarpoolersWithoutApprovedRequests, loading, error]);

  const seatsAvailable = [
    "1 seat available",
    "2 seats available",
    "3 seats available",
  ];

  const handleDateSelect = (nextDate: Date) => {
    setSelectedDate(nextDate);
    setDateAndTime(nextDate.toLocaleString());
    setShowDatePicker(false);
  };

  interface TimeSelectEvent {
    type: string;
    nativeEvent: any;
  }

  interface TimeSelectHandler {
    (event: TimeSelectEvent, selectedTime: Date | undefined): void;
  }

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

  const textColor = useThemeColor({}, "placeholder");

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
            Create a ride
          </Text>
        </View>
        <Text style={{ color: "#FF6A00", fontSize: 22, marginBottom: 15 }}>
          Itinerary
        </Text>
        <Text style={{ color: textColor, marginBottom: 5 }}>From</Text>
        <ThemedAddressCompletionInput
          value={origin}
          onChangeText={setStartingAddress}
          onSuggestionSelect={(address) => {
            setStartingAddress(address);
            console.log("Selected Address:", address);
          }}
          onLatLonSelect={(lat, lon) => {
            setStartingLatLng({ lat, lon });
            console.log("Selected Lat/Lon:", lat, lon);
          }}
          placeholder="Enter Origin"
        />
        <Text style={{ color: textColor, marginBottom: 5, marginTop: 15 }}>
          To
        </Text>
        <ThemedAddressCompletionInput
          value={destination}
          onChangeText={setEndingAddress}
          onSuggestionSelect={setEndingAddress}
          onLatLonSelect={(lat, lon) => {
            setEndingLatLng({ lat, lon });
            console.log("Selected Lat/Lon:", lat, lon);
          }}
          placeholder="Enter Destination"
        />
        <Text style={{ marginBottom: 5, marginTop: 15, color: "#8F9BB3" }}>
          Date & Time of Ride
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
          <Datepicker
            date={selectedDate || undefined}
            onSelect={handleDateSelect}
            style={{ marginRight: 5 }}
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
        <View
          style={{
            width: "100%",
            padding: 20,
            borderTopColor: "#FF8833",
            borderTopWidth: 3,
            borderLeftColor: "#EDF1F7",
            borderLeftWidth: 2,
            borderRightColor: "#EDF1F7",
            borderRightWidth: 2,
            borderBottomColor: "#EDF1F7",
            borderBottomWidth: 2,
            borderRadius: 10,
            backgroundColor: "#fff",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#151A30",
              marginBottom: 10,
            }}
          >
            Route Auto-Match
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#151A30",
              marginBottom: 10,
            }}
          >
            Here are some carpool requests with routes matched to you according
            to our AI module.
          </Text>
          <View
            style={{
              marginTop: 10,
              borderTopColor: "#E4E9F2",
              borderTopWidth: 1,
              width: "100%",
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: "#151A30",
              marginTop: 10,
            }}
          >
            Would you like to pick up other passenger(s)?{"\n"}OR{"\n"}No match
            passenger(s) NOW!!
          </Text>
        </View>
        <MapView
          style={{ width: "100%", height: 300, marginTop: 20 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <Text
          style={{
            color: "#8F9BB3",
            textAlign: "left",
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          You choose the below passenger(s)
        </Text>
        <View style={{ width: "100%", marginBottom: 40 }}>
          <LinearGradient
            colors={["#FF8834", "#E44D4A"]}
            style={{
              width: "100%",
              height: 35,
              borderRadius: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View
              style={{
                width: 60,
                height: 25,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                backgroundColor: "#FF6A00",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                START
              </Text>
            </View>

            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 20,
                backgroundColor: "#1C1C1E",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                A
              </Text>
            </View>

            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 20,
                backgroundColor: "#1C1C1E",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                C
              </Text>
            </View>

            <View
              style={{
                width: 60,
                height: 25,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                backgroundColor: "#DE4141",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                END
              </Text>
            </View>
          </LinearGradient>
          <Text
            style={{
              color: "#FF6A00",
              fontSize: 22,
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            Vehicle Details
          </Text>
          <Text style={{ color: textColor, marginBottom: 5 }}>
            Select Vehicle
          </Text>
          <View>
            <View
              style={{
                backgroundColor: "#F7F9FC",
                height: 43,
                borderColor: "#E4E9F2",
                borderWidth: 1,
                borderRadius: 15,
                paddingLeft: 15,
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Select
                selectedIndex={selectedVehicleIndex}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  if (index instanceof IndexPath) {
                    setSelectedVehicleIndex(index);
                  }
                }}
                value={vehicles[selectedVehicleIndex.row]}
                placeholder="Select Vehicle"
              >
                {vehicles.map((vehicle, index) => (
                  <SelectItem title={vehicle} key={index} />
                ))}
              </Select>
            </View>
            <Text style={{ color: textColor, marginBottom: 5 }}>
              Seats Available
            </Text>
            <View
              style={{
                backgroundColor: "#F7F9FC",
                height: 43,
                borderColor: "#E4E9F2",
                borderWidth: 1,
                borderRadius: 15,
                paddingLeft: 15,
                justifyContent: "center",
              }}
            >
              <Select
                selectedIndex={selectedSeatsIndex}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  if (index instanceof IndexPath) {
                    setSelectedSeatsIndex(index);
                  }
                }}
                value={seatsAvailable[selectedSeatsIndex.row]}
                placeholder="Select Seats Available"
              >
                {seatsAvailable.map((seat, index) => (
                  <SelectItem title={seat} key={index} />
                ))}
              </Select>
            </View>
          </View>

          <Text
            style={{
              color: "#FF6A00",
              fontSize: 22,
              marginTop: 15,
            }}
          >
            Pricing
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              paddingLeft: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <CheckBox
                checked={extraCarseatChecked}
                onChange={(nextChecked) => setExtraCarseatChecked(nextChecked)}
              />
              <Text style={{ marginLeft: 8 }}>With Extra Carseat</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox
                checked={winterTiresChecked}
                onChange={(nextChecked) => setWinterTiresChecked(nextChecked)}
              />
              <Text style={{ marginLeft: 8 }}>With Winter Tires</Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              padding: 10,
              borderTopColor: "#FF6A00",
              borderTopWidth: 3,
              borderColor: "#E4E9F2",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "#222B45" }}>
              • add disclaimer showing we are not collecting money from app
            </Text>
          </View>
          <Text
            style={{
              color: "#FF6A00",
              fontSize: 22,
              marginTop: 15,
            }}
          >
            Trip Preferences
          </Text>
          <Text style={{ color: textColor, marginBottom: 5, marginTop: 10 }}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateRide;
