import React from "react";
import { Text, StyleSheet, FlatList, View, ScrollView } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { Link, useFocusEffect } from "expo-router";
import { GetUserCarpoolsAndRequestsQuery } from "@/graphql/generated";
import { useCallback } from "react";
import MapDriverCard from "@/components/cards/mapDriverCard";
import ActiveRiderCard from "@/components/cards/activeCard";

const CarpoolListScreen: React.FC = () => {
  const currentUser = auth.currentUser;
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

  if (loading) return <Spinner />;
  if (error) return <Text>Error loading carpools</Text>;

  const carpools = data?.getUserCarpoolsAndRequests?.carpools || [];
  const requests = data?.getUserCarpoolsAndRequests?.requests || [];

  const vanessaChildImage = require("@/assets/images/user/vanessa/child/vanessa-child.jpg");
  const evanChildImage = require("@/assets/images/user/evan/child/evan-child.jpg");
  const gloriaChildImage = require("@/assets/images/user/gloria/child/gloria-child.jpg");

  const uniqueRequests = requests.filter(
    (request, index, self) =>
      index === self.findIndex((r) => r.id === request.id)
  );

  return (
    <>
      <ScrollView>
        <View style={{}}>
          <FlatList
            data={carpools}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <Link
                  href={{
                    pathname: "/trips/inProgress/[trip]",
                    params: { trip: item.id },
                  }}
                >
                  <MapDriverCard
                    driverName={item.driver.firstName}
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
        <Text style={styles.sectionTitle}>All Requests</Text>
        <FlatList
          data={uniqueRequests}
          keyExtractor={(request) => request.id}
          renderItem={({ item: request }) => (
            <View>
              {request.carpoolId ? (
                <Link
                  href={{
                    pathname: "/trips/inProgress/[trip]",
                    params: { trip: request.carpoolId },
                  }}
                >
                  <ActiveRiderCard
                    id={request.id}
                    state="pending"
                    date={new Date()}
                    startLocation={request.startAddress || "Unknown"}
                    startTime={request.pickupTime || "Unknown"}
                    endLocation={request.startAddress || "Unknown"}
                    endTime={request.pickupTime || "Unknown"}
                    images={[vanessaChildImage]}
                    recurrence="one time"
                  />
                </Link>
              ) : (
                <ActiveRiderCard
                  id={request.id}
                  state="pending"
                  date={new Date()}
                  startLocation={request.startAddress || "Unknown"}
                  startTime={request.pickupTime || "Unknown"}
                  endLocation={request.startAddress || "Unknown"}
                  endTime={request.pickupTime || "Unknown"}
                  images={[vanessaChildImage]}
                  recurrence="one time"
                />
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
  carpoolCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  carpoolTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  carpoolDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  requestCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  requestDetail: {
    fontSize: 12,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 8,
  },
});

export default CarpoolListScreen;
