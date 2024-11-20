import React from "react";
import { Text, StyleSheet, FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import { Link } from "expo-router";
import { GetUserCarpoolsAndRequestsQuery } from "@/graphql/generated";
import { useTheme } from "@/contexts/ThemeContext";
import { useTextSize } from "@/contexts/TextSizeContext";

const CarpoolListScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const currentUser = auth.currentUser;

  const { data, loading, error } = useQuery<GetUserCarpoolsAndRequestsQuery>(
    GET_USER_CARPOOL_WITH_REQUESTS,
    {
      skip: !currentUser,
      variables: { userId: currentUser?.uid },
    }
  );

  if (loading) return <Spinner />;
  if (error) return <Text style={{ color: currentColors.text }}>Error loading carpools</Text>;

  const carpools = data?.getUserCarpoolsAndRequests?.carpools || [];
  const requests = data?.getUserCarpoolsAndRequests?.requests || [];
  const { isLargeText, textScaleFactor } = useTextSize();

  return (
    <>
      <FlatList
        data={carpools}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.carpoolCard, { backgroundColor: currentColors.background }]}>
            <Link
              key={item.id}
              href={{
                pathname: "/trips/inProgress/[trip]",
                params: { trip: item.id },
              }}
            >
              <Text style={[
                styles.carpoolTitle, 
                { 
                  color: currentColors.text, 
                  fontSize: 18 * textScaleFactor 
                  }]}>
                Carpool on {item.departureDate}
              </Text>
              <Text style={[
                styles.carpoolDetail, 
                { 
                  color: currentColors.text, 
                  fontSize: 14 * textScaleFactor 
                  }]}>
                Start: {item.startAddress}
              </Text>
              <Text style={[
                styles.carpoolDetail, 
                { 
                  color: currentColors.text, 
                  fontSize: 14 * textScaleFactor 
                  }]}>
                Destination: {item.endAddress}
              </Text>
              <Text style={{ color: currentColors.text }}>{item.id}</Text>
            </Link>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: currentColors.text }}>No carpools available.</Text>}
      />

      <Text style={[styles.sectionTitle, { color: currentColors.text, fontSize: 16 * textScaleFactor }]}>All Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(request) => request.id.toString()}
        renderItem={({ item: request }) => (
          <View style={[styles.requestCard, { backgroundColor: currentColors.background }]}>
            {request.carpoolId ? (
              <Link
                href={{
                  pathname: "/trips/inProgress/[trip]",
                  params: { trip: request.carpoolId },
                }}
              >
                <Text style={[
                  styles.requestDetail, 
                  { 
                    color: currentColors.text, 
                    fontSize: 12 * textScaleFactor 
                    }]}>
                  Request by: {request.parent.firstName} (Linked to Carpool)
                </Text>
                <Text style={{ color: currentColors.text }}>{request.carpoolId}</Text>
              </Link>
            ) : (
              <Text style={[
                styles.requestDetail, 
                { 
                  color: currentColors.text, 
                  fontSize: 12 * textScaleFactor
                }]}>
                Request by: {request.parent.firstName} (Not Linked to Carpool)
              </Text>
            )}
            <Text style={[
              styles.requestDetail, 
              { color: currentColors.text, 
              fontSize: 12 * textScaleFactor 
              }]}>
              Child: {request.child.firstName}
            </Text>
            <Text style={[
              styles.requestDetail, 
              { color: currentColors.text, 
              fontSize: 12 * textScaleFactor 
              }]}>
              Pickup Time: {request.pickupTime}
            </Text>
            <Text style={[
              styles.requestDetail, 
              { color: currentColors.text, 
              fontSize: 12 * textScaleFactor 
              }]}>
              Start Address: {request.startAddress}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: currentColors.text }}>No requests available.</Text>}
      />
    </>
  );
};

const styles = StyleSheet.create({
  carpoolCard: {
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
    marginBottom: 4,
  },
  requestCard: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  requestDetail: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 8,
  },
});

export default CarpoolListScreen;
