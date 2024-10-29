import React, { useEffect, useState } from "react";
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
import MapView, { Callout, Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import {
  CheckBox,
  Datepicker,
  IndexPath,
  Select,
  SelectItem,
  Button,
  Layout,
  Popover,
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
import { Request, Vehicle } from "@/graphql/generated";
import { haversineDistance } from "@/utils/distance";
import { useDirections } from "@/hooks/map/useDirections";
import { Polyline } from "react-native-maps";
import { areCoordinatesEqual } from "@/utils/equalCoorordinates";

interface Route {
  coordinates: { latitude: number; longitude: number }[];
  predictedTime?: string;
}

const CreateRide = () => {
  const [startingLatLng, setStartingLatLng] = useState<LatLng>({ lat: 0, lon: 0 });
  const [endingLatLng, setEndingLatLng] = useState<LatLng>({ lat: 0, lon: 0 });
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
  const [activeRoute, setActiveRoute] = useState<{
    coordinates: any[];
    predictedTime?: string;
  }>({
    coordinates: [],
  });
  const [previousRoutes, setPreviousRoutes] = useState<
    { coordinates: any[]; predictedTime?: string }[]
  >([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [extraCarseatChecked, setExtraCarseatChecked] = useState(false);
  const [winterTiresChecked, setWinterTiresChecked] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [visible, setVisible] = React.useState(false);
  const groupId = useLocalSearchParams().groupId;
  const user = auth.currentUser;
  const userId = user?.uid;


  const seatsLeft =
    vehicles[selectedVehicleIndex.row]?.seats - selectedChildren.length || 0;

  const seatsAvailable = Array.from(
    { length: seatsLeft },
    (_, i) => seatsLeft - i
  );

  interface LatLng {
    lat: number;
    lon: number;
  }

  interface CarpoolerRequest {
    id: string;
    startingLat: number;
    startingLon: number;
    startAddress: string;
  }

  interface Route {
    coordinates: { latitude: number; longitude: number }[];
  }

  const isActiveRoute = (route: Route): boolean => {
    return (
      activeRoute &&
      areCoordinatesEqual(route.coordinates, activeRoute.coordinates)
    );
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

  useEffect(() => {
    if (
      startingAddress &&
      endingAddress &&
      dateAndTime !== "Select Date & Time" &&
      time
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [startingAddress, endingAddress, dateAndTime, time]);

  const sortRequestsByDistance = (
    requests: Request[],
    startingLatLng: LatLng
  ) => {
    return [...requests].sort((a: Request, b: Request) => {
      const distanceA = haversineDistance(startingLatLng, {
        lat: a.startingLat,
        lon: a.startingLon,
      });
      const distanceB = haversineDistance(startingLatLng, {
        lat: b.startingLat,
        lon: b.startingLon,
      });
      return distanceA - distanceB;
    });
  };

  const {
    data: getCarpoolersWithoutApprovedRequests,
    loading,
    error,
  } = useQuery(GET_CARPOOLERS_WITHOUT_APPROVED_REQUESTS, {
    variables: {
      groupId: "90575985-3912-4b15-b590-b5b2498b0e0f",
      date: dateAndTime,
      time,
      endingAddress,
    },
    skip: !canSubmit,
    onCompleted: (data) => {
      if (data?.getCarpoolersByGroupWithoutApprovedRequests) {
        console.log("Data:", data.getCarpoolersByGroupWithoutApprovedRequests);
        const sortedRequests = sortRequestsByDistance(
          data.getCarpoolersByGroupWithoutApprovedRequests,
          startingLatLng
        );

        console.log("Sorted Requests:", sortedRequests);

        setRequests(sortedRequests);
      }
    },
  });

  useEffect(() => {
    if (requests.length > 0) {
      const sortedRequests = sortRequestsByDistance(requests, startingLatLng);
      setRequests(sortedRequests);
    }
  }, [startingLatLng]);

  const { data: getVehicleForUser } = useQuery(GET_VEHICLE_FOR_USER, {
    variables: {
      userId,
    },
    skip: !userId,
    onCompleted: (data) => {
      if (data.getVehicleForUser) {
        setVehicles(data.getVehicleForUser);
      }
    },
  });

  const handleDateSelect = (nextDate: Date) => {
    setSelectedDate(nextDate);
    setDateAndTime(nextDate.toLocaleString());
    setShowDatePicker(false);
  };

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

  const { coordinates, getDirections, predictedTime } = useDirections();

  useEffect(() => {
    if (startingAddress && endingAddress && requests.length > 0) {
      const waypoints = requests.map((request) => ({
        latitude: request.startingLat,
        longitude: request.startingLon,
      }));

      getDirections(
        startingLatLng,
        endingLatLng,
        waypoints.slice(0, seatsAvailable[selectedSeatsIndex.row]),
        new Date()
      ).then(({ coordinates: newCoordinates, predictedTime }) => {
        if (newCoordinates.length > 0) {
          if (activeRoute.coordinates.length > 0) {
            const isDuplicate = previousRoutes.some((route) =>
              areCoordinatesEqual(route.coordinates, activeRoute.coordinates)
            );

            if (!isDuplicate) {
              setPreviousRoutes((prevRoutes) => [
                ...prevRoutes,
                {
                  coordinates: activeRoute.coordinates,
                  predictedTime: activeRoute.predictedTime,
                },
              ]);
            }
          }

          setActiveRoute({ coordinates: newCoordinates, predictedTime });
        }
      });
    }
  }, [
    startingAddress,
    endingAddress,
    requests,
    seatsLeft,
    selectedChildren,
    selectedSeatsIndex,
  ]);

  interface Coordinate {
    latitude: number;
    longitude: number;
  }

  const calculateMidpoint = (coordinates: Coordinate[]): Coordinate | null => {
    const totalPoints = coordinates.length;
    if (totalPoints === 0) return null;

    const midpointIndex = Math.floor(totalPoints / 2);
    return coordinates[midpointIndex];
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
          value={startingAddress}
          onChangeText={(text) => setStartingAddress(text)}
          onSuggestionSelect={(address) => {
            console.log("Selected Address:", address);
            setStartingAddress(address);
          }}
          onLatLonSelect={(lat, lon) => {
            console.log("Selected Lat/Lon:", lat, lon);
            setStartingLatLng({ lat, lon });
          }}
          placeholder="Enter Origin"
        />
        <Text style={{ color: textColor, marginBottom: 5, marginTop: 15 }}>
          To
        </Text>
        <ThemedAddressCompletionInput
          value={endingAddress}
          onChangeText={(text) => {
            setEndingAddress(text);
            console.log("Selected Address:", text);
          }}
          onSuggestionSelect={setEndingAddress}
          onLatLonSelect={(lat, lon) => {
            setEndingLatLng({ lat, lon });
            console.log("Selected ending Lat/Lon:", lat, lon);
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
        <ChildSelector onSelectedChildrenChange={setSelectedChildren} />
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
        <View style={{ flex: 1 }}>
          {/* Container for the Map and Predicted Time Box */}
          <MapView
            style={{ width: "100%", height: 300, marginTop: 20 }}
            initialRegion={{
              latitude: 49.2827,
              longitude: -123.1207,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {requests.map((request, index) => (
              <Marker
                key={request.id}
                coordinate={{
                  latitude: request.startingLat,
                  longitude: request.startingLon,
                }}
                title={request.startAddress}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require("../../../assets/images/pin-icon.png")}
                    style={styles.markerImage}
                  />
                  <View style={styles.letterContainer}>
                    <Text style={styles.letterText}>{index + 1}</Text>
                  </View>
                </View>
              </Marker>
            ))}

            {startingLatLng.lat !== 0 && (
              <Marker
                coordinate={{
                  latitude: startingLatLng.lat,
                  longitude: startingLatLng.lon,
                }}
                title={startingAddress}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require("../../../assets/images/starting-pin.png")}
                    style={styles.markerImage}
                  />
                </View>
              </Marker>
            )}

            {endingLatLng.lat !== 0 && (
              <Marker
                coordinate={{
                  latitude: endingLatLng.lat,
                  longitude: endingLatLng.lon,
                }}
                title={endingAddress}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require("../../../assets/images/ending-pin.png")}
                    style={styles.markerImage}
                  />
                </View>
              </Marker>
            )}

            {previousRoutes.map((route, index) => (
              <Polyline
                key={`previous-route-${index}`}
                coordinates={route.coordinates}
                strokeColor={isActiveRoute(route) ? "#FF6A00" : "#ff9950"}
                strokeWidth={isActiveRoute(route) ? 5 : 4}
                lineDashPattern={isActiveRoute(route) ? [] : [5, 5]}
                tappable={true}
                onPress={() => {
                  if (activeRoute.coordinates.length > 0) {
                    const isDuplicate = previousRoutes.some((r) =>
                      areCoordinatesEqual(
                        r.coordinates,
                        activeRoute.coordinates
                      )
                    );
                    if (!isDuplicate) {
                      setPreviousRoutes((prevRoutes) => [
                        ...prevRoutes,
                        { coordinates: activeRoute.coordinates },
                      ]);
                    }
                  }

                  setActiveRoute({
                    coordinates: route.coordinates,
                    predictedTime: route.predictedTime,
                  });
                }}
              />
            ))}

            {coordinates.length > 0 && (
              <Polyline
                coordinates={coordinates.map((coord) => ({
                  latitude: coord.latitude,
                  longitude: coord.longitude,
                }))}
                fillColor="#FFC195"
                strokeColor="#FF6A00"
                strokeWidth={5}
              />
            )}
          </MapView>

          {activeRoute.predictedTime && (
            <View style={styles.predictedTimeBox}>
              <Text style={styles.predictedTimeText}>
                {`Estimated Time: ${activeRoute.predictedTime}`}
              </Text>
            </View>
          )}
        </View>

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
                value={
                  vehicles[selectedVehicleIndex.row]?.make || "Select Vehicle"
                }
                placeholder="Select Vehicle"
              >
                {vehicles.map((vehicle, index) => (
                  <SelectItem
                    title={vehicle.make + " " + vehicle.model}
                    key={index}
                  />
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
                  <SelectItem title={`${seat}`} key={index} />
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
            <Text style={{ fontSize: 16, color: "#222B45", padding: 7 }}>
              Please note that Relay does not handle payment processing. Any
              costs shared between users are arranged directly between them.
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
              borderWidth: 1,
              borderRadius: 15,
              height: 100,
              paddingLeft: 30,
              paddingRight: 30,
            }}
            placeholder="Tell drivers more about any special arrangement, e.g. extra car seat, large instrument"
            multiline={true}
          ></TextInput>
        </View>
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
            {renderToggleButton()}
          </LinearGradient>
          <Popover
            backdropStyle={styles.backdrop}
            visible={visible}
            anchor={() => renderToggleButton()}
            onBackdropPress={() => setVisible(false)}
            style={{
              marginBottom: 400,
              maxWidth: 330,
              height: 80,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Layout style={styles.content}>
              <Text>Your ride has been successfully created👍</Text>
            </Layout>
          </Popover>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 110,
    backgroundColor: "transparent",
  },
  markerImage: {
    width: 40,
    height: 60,
    resizeMode: "contain",
  },
  letterContainer: {
    position: "absolute",
    top: 5,
    backgroundColor: "#000",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  letterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  predictedTimeBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    alignItems: "center",
  },
  predictedTimeText: {
    color: "#fff",
    fontSize: 16,
  },
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

export default CreateRide;
