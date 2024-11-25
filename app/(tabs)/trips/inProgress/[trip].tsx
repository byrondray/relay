import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER, GET_VEHICLE } from "@/graphql/user/queries";
import { GET_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import {
  CarpoolWithRequests,
  Child,
  RequestWithParentAndChild,
  User,
  Vehicle,
} from "@/graphql/generated";
import ShareLocationButton from "@/components/rideInProgress/shareLocationButton";
import ShareFakeLocationButton from "@/components/rideInProgress/shareFakeLocationButton";
import { useLocationSubscription } from "@/hooks/map/useGetLocation";
import DriverMapView from "@/components/rideInProgress/driverMapView";
import RequestMapView from "@/components/rideInProgress/requestMapView";
import { formatDate } from "@/utils/currentDate";
import GpsTrackingInfo from "@/components/rideInProgress/gpsTrackingInfo";
import TimeCard from "@/components/cards/timeCard";
import LocationCard from "@/components/rideInProgress/carpoolAddress";
import RequestCard from "@/components/rideInProgress/carpoolRequest";
import ReviewInfo from "@/components/rideInProgress/reviewInfo";
import { LatLng } from "react-native-maps";
import { haversineDistance } from "@/utils/distance";
import { useCarpoolProximity } from "@/hooks/map/detectIfDriverIsClose";
import { useRealtimeDirections } from "@/hooks/map/useRealtimeDirections";
import { useTheme } from "@/contexts/ThemeContext";
import { SEND_NOTIFICATION_INFO } from "@/graphql/map/queries";
import ClockIcon from "@/assets/images/whiteClock.svg";
import DriverInfo from "@/components/cards/driverCard";

const CarpoolScreen: React.FC = () => {
  const currentUser = auth.currentUser;
  const [error, setError] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<User | null>(null);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [carpoolData, setCarpoolData] = useState<CarpoolWithRequests | null>(
    null
  );
  const [sendNotificationInfo] = useMutation(SEND_NOTIFICATION_INFO);
  const [isDriver, setIsDriver] = useState<boolean>(false);

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

  const handleStopReached = (
    stop: RequestWithParentAndChild & { timeToNextStop?: string | null }
  ) => {
    console.log("Stop reached:", stop);

    sendNotificationInfo({
      variables: {
        carpoolId: tripId,
        notificationType: "NEAR_STOP",
        lat: stop.startLat,
        lon: stop.startLon,
        nextStop: { address: stop.startAddress, requestId: stop.id },
        timeToNextStop: stop.timeToNextStop || "",
        timeUntilNextStop: "",
        isFinalDestination: false,
      },
    })
      .then(() => console.log("NEAR_STOP notification sent."))
      .catch((err) =>
        console.error("Error sending NEAR_STOP notification:", err)
      );

    setCurrentIndex((prevIndex) => prevIndex + 1); // Use callback to avoid stale state
  };

  const handleTripCompleted = () => {
    console.log("Trip completed!");

    sendNotificationInfo({
      variables: {
        carpoolId: tripId,
        notificationType: "FINAL_DESTINATION",
        lat: carpoolData?.endLat || 0,
        lon: carpoolData?.endLon || 0,
        nextStop: null,
        timeToNextStop: "0",
        timeUntilNextStop: "0",
        isFinalDestination: true,
      },
    })
      .then(() => console.log("FINAL_DESTINATION notification sent."))
      .catch((err) =>
        console.error("Error sending FINAL_DESTINATION notification:", err)
      );

    setNextStop(null);
    setIsTripCompleted(true);
  };

  const sendLeavingNotification = useCallback(() => {
    if (isDriver && hasStartedSharingLocation && isLeaving && driverLocation) {
      console.log("Sending LEAVING notification with nextStop:", nextStop);
      sendNotificationInfo({
        variables: {
          carpoolId: tripId,
          notificationType: "LEAVING",
          lat: driverLocation.latitude,
          lon: driverLocation.longitude,
          nextStop: nextStop
            ? { address: nextStop.startAddress, requestId: nextStop.id }
            : null,
          timeToNextStop: nextStop?.timeToNextStop || "",
          timeUntilNextStop: totalPredictedTime || "",
          isFinalDestination: false,
        },
      })
        .then(() => console.log("LEAVING notification sent."))
        .catch((err) =>
          console.error("Error sending LEAVING notification:", err)
        );
    }
  }, [
    isDriver,
    hasStartedSharingLocation,
    isLeaving,
    driverLocation,
    nextStop,
  ]);

  useEffect(() => {
    if (currentIndex < sortedRequests.length) {
      setNextStop(sortedRequests[currentIndex]);
    } else if (carpoolData?.endLat && carpoolData?.endLon) {
      setNextStop({
        id: "final-destination",
        startAddress: carpoolData.endAddress ?? "Final Destination",
        startLat: carpoolData.endLat,
        startLon: carpoolData.endLon,
        child: {} as Child,
        parent: {} as User,
        pickupTime: "",
        timeToNextStop: null,
      });
      console.log("Next stop set to Final Destination");
    } else {
      setNextStop(null);
      console.log("No more stops left.");
    }
  }, [currentIndex, sortedRequests, carpoolData]);

  useEffect(() => {
    if (isDriver && hasStartedSharingLocation && isLeaving && driverLocation) {
      sendLeavingNotification();
    }
  }, [
    isDriver,
    hasStartedSharingLocation,
    isLeaving,
    driverLocation,
    sendLeavingNotification,
  ]);

  useEffect(() => {
    if (
      isDriver &&
      nextStop?.startAddress &&
      nextStop?.id &&
      driverLocation?.latitude &&
      driverLocation?.longitude
    ) {
      console.log("Sending next stop notification:", nextStop);
      sendNotificationInfo({
        variables: {
          carpoolId: tripId,
          notificationType: "NEAR_STOP",
          lat: driverLocation?.latitude,
          lon: driverLocation?.longitude,
          nextStop: { address: nextStop.startAddress, requestId: nextStop.id },
          timeToNextStop: timeToNextStop || "",
          timeUntilNextStop: totalPredictedTime || "",
          isFinalDestination: false,
        },
      })
        .then(() => console.log("NEAR_STOP notification sent."))
        .catch((err) =>
          console.error("Error sending next stop notification:", err)
        );
    }
  }, [isDriver, nextStop]);

  useEffect(() => {
    if (isDriver && isTripCompleted) {
      sendNotificationInfo({
        variables: {
          carpoolId: tripId,
          notificationType: "FINAL_DESTINATION",
          lat: driverLocation?.latitude,
          lon: driverLocation?.longitude,
          nextStop: carpoolData?.endAddress,
          timeToNextStop: "0",
          timeUntilNextStop: "0",
          isFinalDestination: true,
        },
      })
        .then(() => console.log("FINAL notification sent."))
        .catch((err) => console.error("Error sending end notification:", err));
    }
  }, [isDriver, isTripCompleted, driverLocation]);

  useCarpoolProximity({
    requests: sortedRequests,
    endingLat: carpoolData?.endLat ?? 0,
    endingLon: carpoolData?.endLon ?? 0,
    currentIndex,
    onStopReached: (stop) => {
      console.log("Stop reached:", stop);
      setCurrentIndex((prev) => prev + 1); // Move to the next stop
    },
    onTripCompleted: () => {
      console.log("Trip completed!");
      setIsTripCompleted(true); // Mark trip as complete
    },
    driverLocation,
  });

  useEffect(() => {
    if (sortedRequests.length > 0) {
      setNextStop(sortedRequests[0]);
    }
  }, [sortedRequests]);

  const tripId = useLocalSearchParams().trip;

  const {
    data: carpoolsData,
    loading: carpoolsLoading,
    error: carpoolsError,
    refetch,
  } = useQuery(GET_CARPOOL_WITH_REQUESTS, {
    skip: !tripId,
    variables: { carpoolId: tripId },
    onCompleted: (data) => {
      if (data?.getCarpoolWithRequests) {
        const carpool = data.getCarpoolWithRequests;
        if (carpool.driverId === currentUser?.uid) {
          setIsDriver(true);
        } else {
          setIsDriver(false);
        }
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

  useEffect(() => {
    if (tripId) {
      setCarpoolData(null);
      setSortedRequests([]);
      setNextStop(null);
      setIsTripCompleted(false);
      setDriverLocation(null);
      setIsLeaving(false);
      setHasStartedSharingLocation(false);

      refetchCarpoolData();
    }
  }, [tripId]);

  const refetchCarpoolData = () => {
    refetch({ carpoolId: tripId })
      .then(({ data }) => {
        if (data?.getCarpoolWithRequests) {
          const carpool = data.getCarpoolWithRequests;
          setCarpoolData(carpool);

          if (carpool.requests) {
            const sorted = sortCarpoolRequestsByDistance(carpool.requests, {
              latitude: carpool?.startLat || carpool.startLat,
              longitude: carpool?.startLon || carpool.startLon,
            });

            const sortedRequestsWithTime: RequestWithTime[] = sorted.map(
              (req) => ({
                ...req,
                timeToNextStop: null,
              })
            );

            setSortedRequests(sortedRequestsWithTime);
            setNextStop(sortedRequestsWithTime[0]);
          }
        }
      })
      .catch((error) => {
        console.error("Error refetching carpool data:", error);
      });
  };

  const sortCarpoolRequestsByDistance = (
    carpoolRequests: RequestWithParentAndChild[],
    startingLatLng: LatLng
  ): RequestWithParentAndChild[] => {
    const uniqueRequests = Array.from(
      new Map(carpoolRequests.map((request) => [request.id, request])).values()
    );

    return uniqueRequests.sort((a, b) => {
      const distanceA = haversineDistance(
        { lat: startingLatLng.latitude, lon: startingLatLng.longitude },
        { lat: a.startLat, lon: a.startLon }
      );
      const distanceB = haversineDistance(
        { lat: startingLatLng.latitude, lon: startingLatLng.longitude },
        { lat: b.startLat, lon: b.startLon }
      );

      return distanceA - distanceB;
    });
  };

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
    console.log("Location subscription data:", locationData);

    const receivedCarpoolId = locationData?.locationReceived?.carpoolId?.trim();
    const currentTripId = Array.isArray(tripId)
      ? tripId[0].trim()
      : tripId?.trim();

    if (
      receivedCarpoolId &&
      currentTripId &&
      receivedCarpoolId === currentTripId
    ) {
      const { lat, lon } = locationData.locationReceived;

      // Check if the current user is not the driver
      if (locationData.locationReceived.senderId !== currentUser?.uid) {
        console.log("User is not the driver. Setting isDriver to false.");
        setIsDriver(false); // Update isDriver to false
      } else {
        console.log("User is the driver. Setting isDriver to true.");
        setIsDriver(true); // Update isDriver to true
      }

      setDriverLocation({ latitude: lat, longitude: lon });

      if (!hasStartedSharingLocation) {
        console.log("Starting location sharing...");
        setHasStartedSharingLocation(true);
        setIsLeaving(true);

        setTimeout(() => {
          console.log("Resetting isLeaving...");
          setIsLeaving(false);
        }, 5000); // Reset after 5 seconds
      }
    } else if (!locationData) {
      console.warn("Using fallback driver location...");
      if (!hasStartedSharingLocation && !isLeaving) {
        setHasStartedSharingLocation(true);
        setIsLeaving(true);

        setTimeout(() => {
          setIsLeaving(false);
        }, 5000); // Reset after 5 seconds
      }
    } else {
      console.warn("Carpool ID mismatch. Skipping location update.", {
        currentTripId,
        receivedCarpoolId,
      });
      setIsDriver(false); // Set isDriver to false in case of mismatch
    }
  }, [locationData, tripId, hasStartedSharingLocation]);

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
      sortedRequests.length > 0
    ) {
      const waypoints = sortedRequests.map((req) => ({
        latitude: req.startLat,
        longitude: req.startLon,
      }));

      const currentRequestsHash = JSON.stringify(sortedRequests);

      if (processedRequestsRef.current !== currentRequestsHash) {
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

              processedRequestsRef.current = currentRequestsHash; // Update hash
            }
          })
          .catch((error) => {
            console.error("Error fetching directions:", error);
          });
      }
    }
  }, [carpoolData, sortedRequests, memoizedGetRealtimeDirections, tripId]);

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
  const { currentColors } = useTheme();
  return (
    <ScrollView>
      {carpoolData &&
        (carpoolData?.driverId === currentUser?.uid ? (
          <DriverMapView
            key={carpoolData.id}
            driverLocation={driverLocation}
            requests={sortedRequests}
            polyline={polyline}
            carpoolData={carpoolData}
          />
        ) : (
          <RequestMapView
            key={carpoolData.id}
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
          backgroundColor: currentColors.background,
        }}
      >
        <View
          style={{
            width: 50,
            backgroundColor: currentColors.tint,
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
            style={{
              fontSize: 20,
              fontFamily: "Comfortaa",
              color: currentColors.icon,
            }}
          >
            {date}
          </Text>
          <View
            style={{
              backgroundColor: "#35BA00",
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <ClockIcon width={16} height={16} style={{ marginRight: 5 }} />
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Comfortaa",
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              Processing
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 15, marginTop: 20 }}>
          {driverData && vehicleData && carpoolData && (
            <DriverInfo
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
              <ShareFakeLocationButton
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
              />
            </>
          )}
        </View>
        <View style={{ paddingHorizontal: 15, marginBottom: 5 }}>
          <GpsTrackingInfo />
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <TimeCard startTime="08: 30 AM" endTime="09: 32 AM" />
        </View>
        <View style={{ paddingHorizontal: 15, marginBottom: 5 }}>
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
            color: currentColors.text,
            paddingHorizontal: 15,
            fontFamily: "Comfortaa",
            marginBottom: 10,
          }}
        >
          Review to Driver
        </Text>
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <TextInput
            style={{
              width: "100%",
              backgroundColor: currentColors.background,
              borderColor: currentColors.tint,
              borderWidth: 1,
              borderRadius: 15,
              height: 100,
              paddingLeft: 30,
              paddingRight: 30,
              fontFamily: "Comfortaa",
              color: currentColors.placeholder,
            }}
            placeholder="Any preferences for trips? (e.g., preferred age range of kids, allowed stopovers, special requests)"
            placeholderTextColor={currentColors.text}
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
