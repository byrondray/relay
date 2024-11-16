import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_USER, GET_VEHICLE } from "@/graphql/user/queries";
import { GET_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { CarpoolWithRequests, User, Vehicle } from "@/graphql/generated";
import { LinearGradient } from "react-native-svg";
import ShareLocationButton from "@/components/rideInProgress/shareLocationButton";
import { useLocationSubscription } from "@/hooks/map/useGetLocation";
import DriverMapView from "@/components/rideInProgress/driverMapView";
import RequestMapView from "@/components/rideInProgress/requestMapView";

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
      console.log("Driver Location Updated:", {
        latitude: lat,
        longitude: lon,
      });
    }
  }, [locationData]);

  useEffect(() => {
    if (locationData) {
      console.log("Location Data Received on Frontend:", locationData);
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

  console.log(carpoolData?.id);
  return (
    <ScrollView>
      {carpoolData?.driverId === currentUser?.uid ? (
        <DriverMapView driverLocation={driverLocation} />
      ) : (
        <RequestMapView driverLocation={driverLocation} />
      )}
      <View style={{ padding: 15 }}>
        <View style={styles.carpoolCard}>
          {driverData?.imageUrl && (
            <Image
              source={{ uri: driverData?.imageUrl }}
              style={styles.driverImage}
            />
          )}
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driverData?.firstName}</Text>
            <Text style={styles.driverDetails}>
              Car Plate: {vehicleData?.licensePlate}
            </Text>
            <Text style={styles.driverDetails}>
              Vehicle Model: {vehicleData?.model}
            </Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Start time (Estimated)</Text>
            <Text style={styles.time}>{carpoolsData?.departureDate}</Text>
            <Text style={styles.timeLabel}>Arrival time (Estimated)</Text>
            <Text style={styles.time}>{`This will be the arrival time`}</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Start Location</Text>
            <Text style={styles.location}>{carpoolsData?.startAddress}</Text>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.location}>{carpoolsData?.endAddress}</Text>
          </View>
        </View>

        {driverData?.id === currentUser?.uid && (
          <ShareLocationButton
            carpoolId={carpoolData?.id ?? ""}
            currentUser={currentUser}
            driverData={driverData}
            onLocationUpdate={(location) => {
              setDriverLocation(location);
            }}
          />
        )}

        {uniqueRequests?.map((request: any, index: number) => {
          return (
            <View
              key={request.id || index}
              style={[
                styles.requestCard,
                request.parent.id === currentUser?.uid &&
                  styles.currentUserCard,
              ]}
            >
              {request.parent.imageUrl && (
                <Image
                  source={{ uri: request.parent.imageUrl }}
                  style={styles.passengerImage}
                />
              )}
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>
                  {request.parent.firstName}
                </Text>
                <Text style={styles.pickUpLocation}>
                  Pick up Location - Point {index + 1}
                </Text>
                <Text style={styles.location}>{request.startAddress}</Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>Start time (Estimated)</Text>
                <Text style={styles.time}>{request.pickupTime}</Text>
                <Text style={styles.timeLabel}>Arrival time (Estimated)</Text>
                <Text>{`This will be the carpool end time`}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  carpoolCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  driverImage: { width: 50, height: 50, borderRadius: 25 },
  driverInfo: { marginLeft: 16 },
  driverName: { fontSize: 16, fontWeight: "bold" },
  driverDetails: { fontSize: 14, color: "#555" },
  timeInfo: { marginTop: 16 },
  timeLabel: { fontSize: 12, color: "#888" },
  time: { fontSize: 16, fontWeight: "bold" },
  locationInfo: { marginTop: 8 },
  locationLabel: { fontSize: 12, color: "#888" },
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
