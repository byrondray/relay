import React from "react";
import { Text, StyleSheet, FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { Link } from "expo-router";
import { GetUserCarpoolsAndRequestsQuery } from "@/graphql/generated";

const CarpoolListScreen: React.FC = () => {
  const currentUser = auth.currentUser;
  const { data, loading, error } = useQuery<GetUserCarpoolsAndRequestsQuery>(
    GET_USER_CARPOOL_WITH_REQUESTS,
    {
      skip: !currentUser,
      variables: { userId: currentUser?.uid },
      onCompleted: (data) => {},
    }
  );

  if (loading) return <Spinner />;
  if (error) return <Text>Error loading carpools</Text>;

  const carpools = data?.getUserCarpoolsAndRequests?.carpools || [];
  const requests = data?.getUserCarpoolsAndRequests?.requests || [];

  return (
    <>
      <FlatList
        data={carpools}
        keyExtractor={(item) => Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.carpoolCard}>
            <Link
              key={item.id}
              href={{
                pathname: "/trips/inProgress/[trip]",
                params: { trip: item.id },
              }}
            >
              <Text style={styles.carpoolTitle}>
                Carpool on {item.departureDate}
              </Text>
              <Text style={styles.carpoolDetail}>
                Start: {item.startAddress}
              </Text>
              <Text style={styles.carpoolDetail}>
                Destination: {item.endAddress}
              </Text>
              <Text>{item.id}</Text>
            </Link>
          </View>
        )}
        ListEmptyComponent={<Text>No carpools available.</Text>}
      />

      <Text style={styles.sectionTitle}>All Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(request) => Math.random().toString()}
        renderItem={({ item: request }) => (
          <View style={styles.requestCard}>
            {request.carpoolId ? (
              <Link
                href={{
                  pathname: "/trips/inProgress/[trip]",
                  params: { trip: request.carpoolId },
                }}
              >
                <Text style={styles.requestDetail}>
                  Request by: {request.parent.firstName} (Linked to Carpool)
                </Text>
                <Text>{request.carpoolId}</Text>
              </Link>
            ) : (
              <Text style={styles.requestDetail}>
                Request by: {request.parent.firstName} (Not Linked to Carpool)
              </Text>
            )}
            <Text style={styles.requestDetail}>
              Child: {request.child.firstName}
            </Text>
            <Text style={styles.requestDetail}>
              Pickup Time: {request.pickupTime}
            </Text>
            <Text style={styles.requestDetail}>
              Start Address: {request.startAddress}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No requests available.</Text>}
      />
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
