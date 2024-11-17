import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_USER, GET_VEHICLE } from "@/graphql/user/queries";
import { GET_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import { LinearGradient } from "react-native-svg";
import ShareLocationButton from "@/components/rideInProgress/shareLocationButton";
import ShareFakeLocationButton from "@/components/rideInProgress/shareFakeLocationButton";
import { useLocationSubscription } from "@/hooks/map/useGetLocation";
import DriverMapView from "@/components/rideInProgress/driverMapView";
import RequestMapView from "@/components/rideInProgress/requestMapView";
import { fakeDirections } from "@/utils/fakeRouteData";
import { formatDate } from "@/utils/currentDate";
import DriverCardInProgress from "@/components/rideInProgress/driverCardInProgress";
import GpsTrackingInfo from "@/components/rideInProgress/gpsTrackingInfo";
import TimeCard from "@/components/rideInProgress/driveTime";
import LocationCard from "@/components/rideInProgress/carpoolAddress";
import RequestCard from "@/components/rideInProgress/carpoolRequest";
import ReviewInfo from "@/components/rideInProgress/reviewInfo";
import { useThemeColor } from "@/hooks/useThemeColor";

const CarpoolScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<User | null>(null);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [carpoolData, setCarpoolData] = useState<CarpoolWithRequests | null>();
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const currentUser = auth.currentUser;

  const tripId = useLocalSearchParams().trip;

  const {
    data: carpoolsData,
    loading: carpoolsLoading,
    error: carpoolsError,
  } = useQuery(GET_CARPOOL_WITH_REQUESTS, {
    skip: !tripId,
    variables: { carpoolId: tripId },
    onCompleted: (data) => {
      setCarpoolData(data.getCarpoolWithRequests);
    },
  });

  const [fetchDriver, { loading: driverLoading, error: driverError }] =
    useLazyQuery(GET_USER, {
      onCompleted: (data) => {
        setDriverData(data.getUser);
      },
    });

  const [fetchVehicle, { loading: vehicleLoading, error: vehicleError }] =
    useLazyQuery(GET_VEHICLE, {
      onCompleted: (data) => {
        setVehicleData(data.getVehicle);
      },
    });

  useEffect(() => {
    if (carpoolData?.driverId) {
      fetchDriver({ variables: { id: carpoolData.driverId } });
    }
  }, [carpoolData?.driverId, fetchDriver]);

  useEffect(() => {
    if (carpoolData?.vehicleId) {
      fetchVehicle({ variables: { id: carpoolData.vehicleId } })
        .then((result) => {
          if (result.data) {
            setVehicleData(result.data.getVehicle);
          } else {
            console.error("No vehicle data found");
          }
        })
        .catch((err) => {
          console.error("Error fetching vehicle data:", err.message);
          setError(err.message);
        });
    }
  }, [carpoolData?.vehicleId, fetchVehicle]);

  useEffect(() => {
    if (carpoolsError || driverError || vehicleError) {
      const errorMessage =
        carpoolsError?.message ||
        driverError?.message ||
        vehicleError?.message ||
        "Unknown error";
      setError(errorMessage);
    }
  }, [carpoolsError, driverError, vehicleError]);

  const userId = currentUser?.uid;
  const { data: locationData, error: locationError } = userId
    ? useLocationSubscription(userId)
    : { data: null, error: null };

  useEffect(() => {
    if (locationData && locationData.locationReceived) {
      const { lat, lon } = locationData.locationReceived;
      setDriverLocation({ latitude: lat, longitude: lon });
    }
  }, [locationData]);

  useEffect(() => {
    if (locationData) {
    }
    if (locationError) {
      console.error("Location Subscription Error:", locationError);
    }
  }, [locationData, locationError]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (carpoolsLoading || driverLoading || vehicleLoading) {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  const uniqueRequests = carpoolData?.requests?.filter(
    (request: any, index: number, self: any[]) =>
      self.findIndex((r) => r.id === request.id) === index
  );

  const date = formatDate({ date: new Date() });

  return (
    <ScrollView>
      {carpoolData?.driverId === currentUser?.uid ? (
        <DriverMapView driverLocation={driverLocation} />
      ) : (
        <RequestMapView driverLocation={driverLocation} />
      )}
      <View
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          marginTop: -50,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            width: 50,
            backgroundColor: "#FF8833",
            height: 3,
            marginTop: 10,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 15,
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
            marginLeft: 20,
          }}
        >
          <Text
            style={{ fontSize: 20, fontFamily: "Comfortaa", color: "#666666" }}
          >
            {date}
          </Text>
          <View
            style={{
              width: 110,
              backgroundColor: "#35BA00",
              marginRight: 20,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 7,
            }}
          >
            <Image source={require("@/assets/images/processing-icon.png")} />
            <Text style={{ color: "#fff", marginLeft: 3 }}>Processing</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
          {driverData && vehicleData && carpoolData && (
            <DriverCardInProgress
              driverData={driverData}
              vehicleData={vehicleData}
              carpoolData={carpoolData}
            />
          )}
        </View>
        <View style={{ padding: 15 }}>
          {driverData?.id === currentUser?.uid && (
            // <ShareLocationButton
            //   carpoolId={carpoolData?.id ?? ""}
            //   currentUser={currentUser}
            //   driverData={driverData}
            //   onLocationUpdate={(location) => {
            //     setDriverLocation(location);
            //   }}
            // />
            <ShareFakeLocationButton
              carpoolId={carpoolData?.id ?? ""}
              polyline={fakeDirections}
              onLocationUpdate={(location) => {
                setDriverLocation(location);
              }}
            />
          )}
        </View>
        <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
          <GpsTrackingInfo />
        </View>
        <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
          <TimeCard startTime="8:30" endTime="9:32" />
        </View>
        <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
          {carpoolData && <LocationCard carpoolData={carpoolData} />}
        </View>
        {uniqueRequests?.map((request: any, index: number) => {
          const isCurrentUser = request.parent.id === currentUser?.uid;

          return (
            <View style={{ paddingHorizontal: 12 }}>
              <RequestCard
                key={request.id || index}
                request={{
                  ...request,
                }}
                index={index}
                isCurrentUser={isCurrentUser}
              />
            </View>
          );
        })}{" "}
        <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
          <ReviewInfo />
        </View>
        <Text
          style={{
            color: "#8F9BB3",
            paddingHorizontal: 15,
            fontFamily: "Comfortaa",
          }}
        >
          Review to Driver
        </Text>
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <Text
            style={{
              color: "#fff",
              marginBottom: 5,
              marginTop: 10,
              fontFamily: "Comfortaa",
            }}
          >
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
              fontFamily: "Comfortaa",
              color: "#8F9BB3",
            }}
            placeholder="Any preferences for trips? (e.g., preferred age range of kids, allowed stopovers, special requests)"
            multiline={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  timeInfo: { marginTop: 16 },
  timeLabel: { fontSize: 12, color: "#888" },
  time: { fontSize: 16, fontWeight: "bold" },
  location: { fontSize: 14, color: "#333" },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  currentUserCard: { borderColor: "red", borderWidth: 2 },
  passengerImage: { width: 40, height: 40, borderRadius: 20 },
  passengerInfo: { marginLeft: 16 },
  passengerName: { fontSize: 16, fontWeight: "bold" },
  pickUpLocation: { fontSize: 14, color: "#555" },
  locationUpdateCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  updateLabel: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
});

export default CarpoolScreen;
