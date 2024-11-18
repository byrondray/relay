import React, { useState, useEffect, useRef, useCallback } from "react";
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
import {
  CarpoolWithRequests,
  RequestWithParentAndChild,
  User,
  Vehicle,
} from "@/graphql/generated";
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
import { LatLng } from "react-native-maps";
import { haversineDistance } from "@/utils/distance";
import { useCarpoolProximity } from "@/hooks/map/detectIfDriverIsClose";
import { useRealtimeDirections } from "@/hooks/map/useRealtimeDirections";

const CarpoolScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<User | null>(null);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [carpoolData, setCarpoolData] = useState<CarpoolWithRequests | null>(
    null
  );

  const processedRequestsRef = useRef<string | null>(null);

  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [sortedRequests, setSortedRequests] = useState<RequestWithTime[]>([]);

  type RequestWithTime = RequestWithParentAndChild & {
    timeToNextStop?: string | null;
  };

  const [nextStop, setNextStop] = useState<RequestWithTime | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTripCompleted, setIsTripCompleted] = useState<boolean>(false);
  const [hasStartedSharingLocation, setHasStartedSharingLocation] =
    useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const currentUserRequest = sortedRequests.find(
    (request) => request.parent.id === auth.currentUser?.uid
  );

  const handleStopReached = (stop: RequestWithParentAndChild) => {
    console.log("Stop reached:", stop);

    const nextIndex = currentIndex + 1;

    if (nextIndex < sortedRequests.length) {
      setCurrentIndex(nextIndex);
      setNextStop(sortedRequests[nextIndex]);
    } else {
      console.log("No more stops left, reaching final destination.");
      setNextStop(null);
    }
  };

  const handleTripCompleted = () => {
    console.log("Trip completed!");
    setNextStop(null);
    setIsTripCompleted(true);
  };

  useCarpoolProximity({
    requests: sortedRequests,
    endingLat: carpoolData?.endLat ?? 0,
    endingLon: carpoolData?.endLon ?? 0,
    onStopReached: handleStopReached,
    onTripCompleted: handleTripCompleted,
  });

  useEffect(() => {
    if (sortedRequests.length > 0) {
      setNextStop(sortedRequests[0]);
    }
  }, [sortedRequests]);

  const currentUser = auth.currentUser;
  const tripId = useLocalSearchParams().trip;

  const sortCarpoolRequestsByDistance = (
    carpoolRequests: RequestWithParentAndChild[],
    startingLatLng: LatLng
  ): RequestWithParentAndChild[] => {
    console.log("Sorting requests with startingLatLng:", startingLatLng);

    const uniqueRequests = Array.from(
      new Map(carpoolRequests.map((request) => [request.id, request])).values()
    );

    return uniqueRequests.sort((a, b) => {
      console.log("Request A:", a.startLat, a.startLon);
      console.log("Request B:", b.startLat, b.startLon);

      const distanceA = haversineDistance(
        { lat: startingLatLng.latitude, lon: startingLatLng.longitude },
        { lat: a.startLat, lon: a.startLon }
      );
      const distanceB = haversineDistance(
        { lat: startingLatLng.latitude, lon: startingLatLng.longitude },
        { lat: b.startLat, lon: b.startLon }
      );

      console.log(`Distance A: ${distanceA}, Distance B: ${distanceB}`);
      return distanceA - distanceB;
    });
  };

  const {
    data: carpoolsData,
    loading: carpoolsLoading,
    error: carpoolsError,
  } = useQuery(GET_CARPOOL_WITH_REQUESTS, {
    skip: !tripId,
    variables: { carpoolId: tripId },
    onCompleted: (data) => {
      if (data?.getCarpoolWithRequests) {
        const carpool = data.getCarpoolWithRequests;
        console.log("Carpool data:", carpool);
        setCarpoolData(carpool);

        if (carpool.requests) {
          const sorted = sortCarpoolRequestsByDistance(carpool.requests, {
            latitude: carpool?.startLat || carpool.startLat,
            longitude: carpool?.startLon || carpool.startLon,
          });

          // @ts-ignore
          const sortedRequestss: RequestWithTime[] = sorted.map((req) => ({
            ...req,
            timeToNextStop: null,
          }));

          if (sortedRequestss.length > 0) {
            setSortedRequests(sortedRequestss);
            setNextStop(sortedRequests[0]);
          }
        }
      }
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

      if (!hasStartedSharingLocation) {
        setHasStartedSharingLocation(true);
        setIsLeaving(true);
      } else {
        setIsLeaving(false);
      }
    }
  }, [locationData, hasStartedSharingLocation]);

  const {
    polyline,
    totalPredictedTime,
    timeToNextStop,
    directionsLog,
    legs,
    getRealtimeDirections,
  } = useRealtimeDirections();

  const memoizedGetRealtimeDirections = useCallback(getRealtimeDirections, [
    getRealtimeDirections,
  ]);

  useEffect(() => {
    if (
      carpoolData &&
      carpoolData.startLat &&
      carpoolData.startLon &&
      carpoolData.endLat &&
      carpoolData.endLon &&
      sortedRequests.length > 0 &&
      processedRequestsRef.current !== JSON.stringify(sortedRequests)
    ) {
      const waypoints = sortedRequests.map((req) => ({
        latitude: req.startLat,
        longitude: req.startLon,
      }));

      memoizedGetRealtimeDirections(
        {
          lat: carpoolData.startLat,
          lon: carpoolData.startLon,
        },
        {
          lat: carpoolData.endLat,
          lon: carpoolData.endLon,
        },
        waypoints,
        sortedRequests,
        new Date()
      )
        .then((result) => {
          if (result && result.legs.length > 0) {
            const updatedRequests = sortedRequests.map((request, index) => ({
              ...request,
              timeToNextStop: result.legs[index]?.duration || "",
            }));

            setSortedRequests(updatedRequests);
            setNextStop(updatedRequests[0]);

            processedRequestsRef.current = JSON.stringify(sortedRequests);
          }
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });
    } else {
      console.log("Conditions not met for fetching directions");
    }
  }, [carpoolData, sortedRequests, memoizedGetRealtimeDirections]);

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

  const date = formatDate({ date: new Date() });

  const uniqueRequests = Array.from(
    new Map(
      (carpoolData?.requests ?? []).map((request) => [request.id, request])
    ).values()
  );

  return (
    <ScrollView>
      {carpoolData &&
        (carpoolData?.driverId === currentUser?.uid ? (
          <DriverMapView
            driverLocation={driverLocation}
            requests={sortedRequests}
            polyline={polyline}
            carpoolData={carpoolData}
          />
        ) : (
          <RequestMapView
            driverLocation={driverLocation}
            currentUserRequest={currentUserRequest || null}
            polyline={polyline}
            carpoolData={carpoolData}
          />
        ))}
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
            <>
              <ShareLocationButton
                carpoolId={carpoolData?.id ?? ""}
                onLocationUpdate={(location) => {
                  setDriverLocation(location);
                }}
                nextStop={{
                  address: nextStop?.startAddress ?? "",
                  requestId: nextStop?.id ?? "",
                }}
                timeToNextStop={nextStop?.timeToNextStop ?? ""}
                totalTime={totalPredictedTime}
                timeUntilNextStop={nextStop?.timeToNextStop ?? ""}
                isLeaving={isLeaving}
                isFinalDestination={isTripCompleted}
              />
            </>
          )}
          {driverData && driverData.id === currentUser?.uid && (
            <>
              {/* <ShareFakeLocationButton
                carpoolId={carpoolData?.id ?? ""}
                polyline={polyline}
                nextStop={{
                  address: nextStop?.startAddress ?? "",
                  requestId: nextStop?.id ?? "",
                }}
                timeToNextStop={nextStop?.timeToNextStop ?? ""}
                totalTime={totalPredictedTime}
                timeUntilNextStop={nextStop?.timeToNextStop ?? ""}
                isLeaving={isLeaving}
                onLocationUpdate={(location) => {
                  setDriverLocation(location);
                }}
                isFinalDestination={isTripCompleted}
              /> */}
            </>
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
        })}
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
