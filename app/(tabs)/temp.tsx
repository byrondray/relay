import React, { useEffect, useState } from "react";
import { Text, StyleSheet, FlatList, View, ScrollView } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { GetUserCarpoolsAndRequestsQuery } from "@/graphql/generated";
import { useCallback } from "react";
import MapDriverCard from "@/components/cards/mapDriverCard";
import ActiveRiderCard from "@/components/cards/activeCard";
import { useTheme } from "@/contexts/ThemeContext";

const CarpoolListScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const currentUser = auth.currentUser;

  const { success, type } = useLocalSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data, loading, error, refetch } =
    useQuery<GetUserCarpoolsAndRequestsQuery>(GET_USER_CARPOOL_WITH_REQUESTS, {
      skip: !currentUser,
      variables: { userId: currentUser?.uid },
    });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (success === "true") {
      if (type === "carpool") {
        setSuccessMessage("Carpool created successfully!");
      } else if (type === "request") {
        setSuccessMessage("Request submitted successfully!");
      }
      setShowSuccessMessage(true);

      // Automatically hide the message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [success, type]);

  if (loading) return <Spinner />;
  if (error)
    return (
      <Text style={{ color: currentColors.text }}>Error loading carpools</Text>
    );

  const carpools = data?.getUserCarpoolsAndRequests?.carpools || [];
  const requests = data?.getUserCarpoolsAndRequests?.requests || [];

  const vanessaChildImage = require("@/assets/images/user/vanessa/child/vanessa-child.jpg");
  const evanChildImage = require("@/assets/images/user/evan/child/evan-child.jpg");
  const gloriaChildImage = require("@/assets/images/user/gloria/child/gloria-child.jpg");

  const uniqueRequests = requests.filter(
    (request, index, self) =>
      index === self.findIndex((r) => r.id === request.id)
  );

  const currentHour = new Date().getHours();
  let timeOfDay = "Morning";
  if (currentHour >= 12 && currentHour < 18) {
    timeOfDay = "Afternoon";
  } else if (currentHour >= 18) {
    timeOfDay = "Evening";
  }

  const driverName =
    carpools.length > 0 ? carpools[0].driver.firstName : "User";

  return (
    <>
      <ScrollView>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          {showSuccessMessage && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}
          <Text
            style={{
              fontFamily: "Comfortaa",
              fontWeight: "500",
              fontSize: 14,
              marginBottom: -10,
            }}
          >
            {timeOfDay}
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontWeight: "700",
              fontSize: 24,
              marginBottom: 16,
              marginTop: 10,
            }}
          >
            {driverName}
          </Text>
          <FlatList
            data={carpools}
            style={{ borderRadius: 20 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <Link
                  href={{
                    pathname: "/trips/inProgress/[trip]",
                    params: { trip: item.id },
                  }}
                  style={{ marginRight: 10, marginBottom: 10 }}
                >
                  <MapDriverCard
                    driverName={item.driver.firstName}
                    driverImage={item.driver.imageUrl}
                    id={item.id}
                    driveCount={22}
                    likes={300}
                    date={new Date(item.departureDate)}
                    duration={"23 mins"}
                    startLocation={item.startAddress}
                    startTime={item.departureTime}
                    endLocation={item.endAddress}
                    endTime={item.departureTime}
                    passengerImages={[
                      vanessaChildImage,
                      evanChildImage,
                      gloriaChildImage,
                    ]}
                  />
                </Link>
              );
            }}
            ListEmptyComponent={<Text>No carpools available.</Text>}
            horizontal={carpools.length > 1}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Text style={styles.sectionTitle}>Confirmed</Text>
        <FlatList
          data={uniqueRequests}
          keyExtractor={(request) => request.id}
          renderItem={({ item: request }) => (
            <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
              {request.carpoolId && (
                <Link
                  href={{
                    pathname: "/trips/inProgress/[trip]",
                    params: { trip: request.carpoolId },
                  }}
                >
                  <ActiveRiderCard
                    id={request.id}
                    state="confirmed"
                    date={new Date()}
                    startLocation={request.startAddress || "Unknown"}
                    startTime={request.pickupTime || "Unknown"}
                    endLocation={request.startAddress || "Unknown"}
                    endTime={request.pickupTime || "Unknown"}
                    images={[vanessaChildImage]}
                    recurrence="one time"
                  />
                </Link>
              )}
            </View>
          )}
          ListEmptyComponent={<Text>No requests available.</Text>}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  successMessage: {
    backgroundColor: "#d4edda",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  successText: {
    color: "#155724",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 8,
  },
});

export default CarpoolListScreen;
