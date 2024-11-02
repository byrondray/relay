import React, { useEffect, useRef, useState } from "react";
import { ThemedAddressCompletionInput } from "@/components/ThemedAddressCompletionInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import MapView from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Button, IndexPath, Layout, Popover } from "@ui-kitten/components";
import ChildSelector from "@/components/carpool/childSelector";
import { useQuery } from "@apollo/client";
import { auth } from "@/firebaseConfig";
import { Carpool, Group, Request } from "@/graphql/generated";
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
  StyleSheet,
} from "react-native";
import RadioGroupComponent from "@/components/carpool/carpoolFrequency";
import { CreateCarpoolInput } from "@/graphql/generated";
import GroupPicker from "@/components/carpool/groupSelector";

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
    selectedSeatsIndex,
    setSelectedSeatsIndex,
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

  const [createCarpool] = useMutation<
    { createCarpool: Carpool },
    { input: CreateCarpoolInput }
  >(CREATE_CARPOOL);

  const [requests, setRequests] = useState<Request[]>([]);
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

  const { data } = useQuery(GET_GROUPS, {
    onCompleted: (data) => {
      console.log("Data", data);
      if (data) {
        console.log("Groups", data.getGroups);
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
    skip: !canSubmit,
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
  const mapRef = useRef<MapView>(null);

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

          if (mapRef.current) {
            mapRef.current.fitToCoordinates(newCoordinates, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
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
    selectedGroupIndex,
  ]);

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
          <CarpoolPickerBar />
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
                // createCarpool({
                //   variables: {
                //     input: {
                //       driverId: userId!,
                //       startLat: startingLatLng.lat,
                //       startLon: startingLatLng.lon,
                //       endLat: endingLatLng.lat,
                //       endLon: endingLatLng.lon,
                //       startAddress: startingAddress,
                //       endAddress: endingAddress,
                //       departureDate: dateAndTime,
                //       departureTime: time,
                //       tripPreferences: description,
                //       vehicleId: vehicles[selectedVehicleIndex.row].id,
                //       extraCarseat: extraCarseatChecked,
                //       winterTires: winterTiresChecked,
                //       children: selectedChildren.map((child) => child.id),
                //       payment: {
                //         amount: 10,
                //         currency: "USD",
                //       },
                //     },
                //   },
                // });
              }}
            >
              {() => (
                <Text style={{ color: "#fff", fontSize: 16 }}>Submit</Text>
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
