import React, { useEffect, useMemo, useRef, useState } from "react";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import MapView, { LongPressEvent, MapPressEvent } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import {
  Button,
  IndexPath,
  Layout,
  Popover,
  Spinner,
} from "@ui-kitten/components";
import ChildSelector from "@/components/carpool/childSelector";
import { useQuery } from "@apollo/client";
import { auth } from "@/firebaseConfig";
import {
  Carpool,
  Group,
  RequestWithChildrenAndParent,
} from "@/graphql/generated";
import { haversineDistance } from "@/utils/distance";
import { useDirections } from "@/hooks/map/useDirections";
import { areCoordinatesEqual } from "@/utils/equalCoorordinates";
import CarFeaturesCheckbox from "@/components/carpool/carFeaturesCheckbox";
import TripDescriptionInput from "@/components/carpool/carpoolDescription";
import RideDateTimePicker from "@/components/carpool/dateAndTimePicker";
import MapAiInfo from "@/components/carpool/mapAiInfo";
import RideMap from "@/components/carpool/rideMap";
import CarpoolPickerBar from "@/components/carpool/carpoolPickerBar";
import VehicleDetailsPicker from "@/components/carpool/vehicleDetails";
import PaymentInfo from "@/components/carpool/paymentInfo";
import { useRideState } from "@/hooks/carpoolCreateState";
import { useMutation } from "@apollo/client";
import { GET_VEHICLE_FOR_USER } from "@/graphql/user/queries";
import {
  GET_CARPOOLERS_WITHOUT_APPROVED_REQUESTS,
  CREATE_CARPOOL,
} from "@/graphql/carpool/queries";
import { GET_GROUPS } from "@/graphql/group/queries";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from "react-native";
import RadioGroupComponent from "@/components/carpool/carpoolFrequency";
import { CreateCarpoolInput } from "@/graphql/generated";
import GroupPicker from "@/components/carpool/groupSelector";
import WaypointSelector from "@/components/carpool/waypointSelector";
import { Marker } from "react-native-maps";
import { Image } from "react-native";
import { Polyline } from "react-native-maps";
import GestureMap from "@/components/carpool/gestureMap";

const { height: deviceHeight } = Dimensions.get("window");

const CreateRide = () => {
  const {
    endingLatLng,
    setEndingLatLng,
    startingLatLng,
    setStartingLatLng,
    startingAddress,
    setStartingAddress,
    endingAddress,
    setEndingAddress,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    dateAndTime,
    setDateAndTime,
    canSubmit,
    setCanSubmit,
    extraCarseatChecked,
    setExtraCarseatChecked,
    winterTiresChecked,
    setWinterTiresChecked,
    showTimePicker,
    setShowTimePicker,
    time,
    setTime,
    vehicles,
    setVehicles,
    selectedChildren,
    setSelectedChildren,
    visible,
    setVisible,
    description,
    setDescription,
    selectedVehicleIndex,
    setSelectedVehicleIndex,
    activeRoute,
    setActiveRoute,
    previousRoutes,
    setPreviousRoutes,
    selectedIndex,
    setSelectedIndex,
  } = useRideState();

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<IndexPath>(
    new IndexPath(0)
  );
  const [groupId, setGroupId] = useState<string | null>(null);
  const [selectedWaypoints, setSelectedWaypoints] = useState<
    RequestWithChildrenAndParent[]
  >([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const hasInitialDirectionsLoadedRef = useRef(false);

  const [createCarpool] = useMutation<
    { createCarpool: Carpool },
    { input: CreateCarpoolInput }
  >(CREATE_CARPOOL);

  const [requests, setRequests] = useState<RequestWithChildrenAndParent[]>([]);
  const user = auth.currentUser;
  const userId = user?.uid;

  const totalSeatsTakenByWaypoints = selectedWaypoints.reduce(
    (acc, waypoint) => {
      return acc + waypoint.children.length;
    },
    0
  );

  const [seatsLeft, setSeatsLeft] = useState(0);
  const [seatsAvailable, setSeatsAvailable] = useState<number[]>([]);
  const [selectedSeatsIndex, setSelectedSeatsIndex] = useState(
    new IndexPath(0)
  );

  useEffect(() => {
    const newSeatsLeft =
      (vehicles[selectedVehicleIndex.row]?.seats || 0) -
      selectedChildren.length -
      totalSeatsTakenByWaypoints;

    setSeatsLeft(newSeatsLeft);

    const newSeatsAvailable =
      newSeatsLeft > 0
        ? Array.from({ length: newSeatsLeft + 1 }, (_, i) => newSeatsLeft - i)
        : [0];

    setSeatsAvailable(newSeatsAvailable);

    setSelectedSeatsIndex((prevIndex) => {
      if (newSeatsAvailable.length === 1 && newSeatsAvailable[0] === 0) {
        return new IndexPath(0);
      }
      return prevIndex.row < newSeatsAvailable.length
        ? prevIndex
        : new IndexPath(newSeatsAvailable.length - 1);
    });
  }, [
    selectedVehicleIndex,
    selectedChildren,
    totalSeatsTakenByWaypoints,
    vehicles,
  ]);

  interface LatLng {
    lat: number;
    lon: number;
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
    requests: RequestWithChildrenAndParent[],
    startingLatLng: LatLng
  ) => {
    return [...requests].sort(
      (a: RequestWithChildrenAndParent, b: RequestWithChildrenAndParent) => {
        const distanceA = haversineDistance(startingLatLng, {
          lat: parseFloat(a.startingLat),
          lon: parseFloat(a.startingLon),
        });
        const distanceB = haversineDistance(startingLatLng, {
          lat: parseFloat(b.startingLat),
          lon: parseFloat(b.startingLon),
        });
        return distanceA - distanceB;
      }
    );
  };

  const { data, loading: groupsLoading } = useQuery(GET_GROUPS, {
    onCompleted: (data) => {
      if (data) {
        setGroups(data.getGroups);
      }
    },
  });

  useEffect(() => {
    const selectedGroup = groups[selectedGroupIndex.row];
    setGroupId(selectedGroup ? selectedGroup.id : null);
    setCanSubmit(!!selectedGroup);
  }, [selectedGroupIndex, groups]);

  const {
    data: getCarpoolersWithoutApprovedRequests,
    loading,
    error,
  } = useQuery(GET_CARPOOLERS_WITHOUT_APPROVED_REQUESTS, {
    variables: {
      groupId,
      date: dateAndTime,
      time,
      endingAddress,
    },
    skip:
      !canSubmit ||
      !groupId ||
      !dateAndTime ||
      !time ||
      !endingAddress ||
      !startingAddress,
    onCompleted: (data) => {
      if (data?.getCarpoolersByGroupWithoutApprovedRequests) {
        const sortedRequests = sortRequestsByDistance(
          data.getCarpoolersByGroupWithoutApprovedRequests,
          startingLatLng
        );
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

  const {
    data: getVehicleForUser,
    error: vehcilesError,
    loading: vehiclesLoading,
  } = useQuery(GET_VEHICLE_FOR_USER, {
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
  const mapRef = useRef<MapView>(null);

  const waypoints = useMemo(() => {
    const points = [];
    let cumulativeSeatsTaken = 0;
    const seatLimit = seatsAvailable[selectedSeatsIndex.row];

    for (const request of requests) {
      const seatsTakenByRequest = request.children.length;
      if (cumulativeSeatsTaken + seatsTakenByRequest <= seatLimit) {
        points.push({
          latitude: parseFloat(request.startingLat),
          longitude: parseFloat(request.startingLon),
        });
        cumulativeSeatsTaken += seatsTakenByRequest;
      }
      if (cumulativeSeatsTaken >= seatLimit) break;
    }
    return points;
  }, [requests, seatsAvailable[selectedSeatsIndex.row]]);

  const selectedRequests = useMemo(() => {
    const selected = [];
    let cumulativeSeatsTaken = 0;
    const seatLimit = seatsAvailable[selectedSeatsIndex.row];

    for (const request of requests) {
      const seatsTakenByRequest = request.children.length;
      if (cumulativeSeatsTaken + seatsTakenByRequest <= seatLimit) {
        selected.push(request);
        cumulativeSeatsTaken += seatsTakenByRequest;
      }
      if (cumulativeSeatsTaken >= seatLimit) break;
    }
    return selected;
  }, [requests, seatsAvailable[selectedSeatsIndex.row]]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current && selectedRequests.length > 0) {
      setSelectedWaypoints(selectedRequests);
      isInitialLoad.current = false;
    }
  }, [selectedRequests]);

  useEffect(() => {
    if (startingAddress && endingAddress && selectedWaypoints.length > 0) {
      const waypointsForDirections = selectedWaypoints.map((wp) => ({
        latitude: parseFloat(wp.startingLat),
        longitude: parseFloat(wp.startingLon),
      }));

      getDirections(
        startingLatLng,
        endingLatLng,
        waypointsForDirections,
        new Date()
      ).then(({ coordinates: newCoordinates, predictedTime }) => {
        if (newCoordinates.length > 0) {
          const isDuplicate = previousRoutes.some((route) =>
            areCoordinatesEqual(route.coordinates, newCoordinates)
          );

          if (!isDuplicate) {
            setPreviousRoutes((prevRoutes) => [
              ...prevRoutes,
              {
                coordinates: newCoordinates,
                predictedTime,
              },
            ]);
          }

          setActiveRoute({ coordinates: newCoordinates, predictedTime });

          if (mapRef.current) {
            mapRef.current.fitToCoordinates(newCoordinates, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }

          hasInitialDirectionsLoadedRef.current = true;
        }
      });
    }
  }, [
    startingAddress,
    endingAddress,
    selectedWaypoints,
    startingLatLng,
    endingLatLng,
  ]);

  const getAddress = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      return "Address not found";
    } catch (error) {
      console.error(error);
      return "Error fetching address";
    }
  };

  const mapHeight = useRef(new Animated.Value(300)).current;

  const toggleFullScreen = (expand: boolean) => {
    const newHeight = expand ? deviceHeight : 300;
    setIsFullScreen(expand);
    Animated.timing(mapHeight, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 50 && !isFullScreen) {
          toggleFullScreen(true);
        } else if (gestureState.dy < -50 && isFullScreen) {
          toggleFullScreen(false);
        }
      },
    })
  ).current;

  const handleLongPress = async (e: LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    console.log("Long press detected at:", latitude, longitude);

    if (startingLatLng.lat === 0 && startingLatLng.lon === 0) {
      setStartingLatLng({ lat: latitude, lon: longitude });
      const address = await getAddress(latitude, longitude);
      setStartingAddress(address);
    } else if (endingLatLng.lat === 0 && endingLatLng.lon === 0) {
      setEndingLatLng({ lat: latitude, lon: longitude });
      const address = await getAddress(latitude, longitude);
      setEndingAddress(address);
    } else {
      console.log("Both pins are already set.");
    }
  };

  const textColor = useThemeColor({}, "placeholder");

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#ffffff",
          flexGrow: 1,
        }}
      >
        <GestureMap
          mapHeight={mapHeight}
          activeRoute={activeRoute}
          coordinates={coordinates}
          endingAddress={endingAddress}
          endingLatLng={endingLatLng}
          handleLongPress={handleLongPress}
          isFullScreen={isFullScreen}
          panResponder={panResponder}
          previousRoutes={previousRoutes}
          requests={requests}
          startingAddress={startingAddress}
          startingLatLng={startingLatLng}
          toggleFullScreen={toggleFullScreen}
        />
        <View style={{ padding: 15 }}>
          <View>
            <Text
              style={{
                fontSize: 32,
                marginBottom: 20,
                fontFamily: "Comfortaa-semibold",
              }}
            >
              Create a ride
            </Text>
          </View>
          <Text style={{ color: "#FF6A00", fontSize: 22, marginBottom: 15 }}>
            Itinerary
          </Text>
          <RadioGroupComponent
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
          <Text style={{ color: textColor, marginBottom: 5 }}>From</Text>
          <ThemedAddressCompletionInput
            value={startingAddress}
            onChangeText={(text) => setStartingAddress(text)}
            onSuggestionSelect={(address) => {
              setStartingAddress(address);
            }}
            onLatLonSelect={(lat, lon) => {
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
            }}
            onSuggestionSelect={setEndingAddress}
            onLatLonSelect={(lat, lon) => {
              setEndingLatLng({ lat, lon });
            }}
            placeholder="Enter Destination"
          />
          <RideDateTimePicker
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
            selectedTime={time}
            handleTimeSelect={handleTimeConfirm}
            textColor={textColor}
          />
          <Text style={{ color: textColor, marginBottom: 10, marginTop: 15 }}>
            Seats Occupied
          </Text>
          <ChildSelector onSelectedChildrenChange={setSelectedChildren} />
          <GroupPicker
            groups={groups}
            selectedGroupIndex={selectedGroupIndex}
            setSelectedGroupIndex={setSelectedGroupIndex}
            textColor={textColor}
          />
          <MapAiInfo />
          <RideMap
            mapRef={mapRef}
            requests={requests}
            startingLatLng={startingLatLng}
            endingLatLng={endingLatLng}
            startingAddress={startingAddress}
            endingAddress={endingAddress}
            previousRoutes={previousRoutes}
            coordinates={coordinates}
            activeRoute={activeRoute}
            setActiveRoute={setActiveRoute}
            setPreviousRoutes={setPreviousRoutes}
            styles={styles}
            isActiveRoute={isActiveRoute}
            areCoordinatesEqual={areCoordinatesEqual}
            setSelectedWaypoints={setSelectedWaypoints}
          />
          <WaypointSelector
            requests={requests}
            selectedWaypoints={selectedWaypoints}
            seatsAvailable={seatsLeft}
            setSelectedWaypoints={setSelectedWaypoints}
            vehicles={vehicles}
            selectedVehicleIndex={selectedVehicleIndex}
            selectedChildren={selectedChildren}
          />
          <Text
            style={{
              color: "#8F9BB3",
              textAlign: "left",
              marginTop: 5,
              marginBottom: 5,
              fontFamily: "Comfortaa",
            }}
          >
            You choose the below passenger(s)
          </Text>
          <View style={{ width: "100%", marginBottom: 40 }}>
            <CarpoolPickerBar
              selectedWaypoints={selectedWaypoints}
              sortedRequests={requests}
            />
            <VehicleDetailsPicker
              selectedVehicleIndex={selectedVehicleIndex}
              selectedSeatsIndex={selectedSeatsIndex}
              vehicles={vehicles}
              seatsAvailable={seatsAvailable}
              setSelectedVehicleIndex={setSelectedVehicleIndex}
              setSelectedSeatsIndex={setSelectedSeatsIndex}
              textColor={textColor}
            />
            <Text
              style={{
                color: "#FF6A00",
                fontSize: 22,
                marginTop: 15,
                fontFamily: "Comfortaa",
              }}
            >
              Pricing
            </Text>
            <CarFeaturesCheckbox
              extraCarseatChecked={extraCarseatChecked}
              winterTiresChecked={winterTiresChecked}
              setExtraCarseatChecked={setExtraCarseatChecked}
              setWinterTiresChecked={setWinterTiresChecked}
            />
            <PaymentInfo />
            <Text
              style={{
                color: "#FF6A00",
                fontSize: 22,
                marginTop: 15,
                fontFamily: "Comfortaa",
              }}
            >
              Trip Preferences
            </Text>
            <TripDescriptionInput
              textColor={textColor}
              description={description}
              setDescription={setDescription}
            />
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
              <Button
                style={{
                  width: "100%",
                  paddingVertical: 12,
                }}
                appearance="ghost"
                onPress={() => {
                  handleModelSubmit();
                  createCarpool({
                    variables: {
                      input: {
                        driverId: userId!,
                        startLat: startingLatLng.lat,
                        startLon: startingLatLng.lon,
                        endLat: endingLatLng.lat,
                        endLon: endingLatLng.lon,
                        startAddress: startingAddress,
                        endAddress: endingAddress,
                        departureDate: dateAndTime,
                        departureTime: time,
                        tripPreferences: description,
                        vehicleId: vehicles[selectedVehicleIndex.row].id,
                        extraCarSeat: extraCarseatChecked,
                        winterTires: winterTiresChecked,
                        requestIds: selectedWaypoints.map((child) => child.id),
                        driverChildIds: selectedChildren.map((child) => child),
                        groupId: groupId!,
                      },
                    },
                  });
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
