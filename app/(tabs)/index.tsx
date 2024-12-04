import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_CARPOOL_WITH_REQUESTS } from "@/graphql/carpool/queries";
import { Spinner } from "@ui-kitten/components";
import { auth } from "@/firebaseConfig";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { GetUserCarpoolsAndRequestsQuery } from "@/graphql/generated";
import { useCallback } from "react";
import MapDriverCard from "@/components/cards/mapDriverCard";
import { useTheme } from "@/contexts/ThemeContext";
import withAuthCheck from "@/components/WithAuthCheck";
import { GET_USER } from "@/graphql/user/queries";
import ActiveRiderCard from "@/components/cards/activeCard";

const CarpoolListScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const currentUser = auth.currentUser;
  const { success, type, hasOnboarded } = useLocalSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [onBoarded, setOnBoarded] = useState(false);

  console.log("Onboarding status:", { hasOnboarded, onBoarded });

  useEffect(() => {
    if (hasOnboarded === "true" || onBoarded) {
      setOnBoarded(true);
    }
  }, [hasOnboarded, onBoarded]);

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
    console.log("Onboarding status:", { hasOnboarded, onBoarded });
    const timer = setTimeout(() => {
      if (currentUser?.uid === "VQDrhC1urNVkssfgLc8jZWVRpo32" && !onBoarded) {
        console.log("Redirecting to Onboarding");
        router.push("/OnboardForms/parent");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, onBoarded]);

  useEffect(() => {
    if (success === "true") {
      if (type === "carpool") {
        setSuccessMessage("Carpool created successfully!");
      } else if (type === "request") {
        setSuccessMessage("Request submitted successfully!");
      }
      setShowSuccessMessage(true);

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, type]);

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

  const skipQuery = !currentUser?.uid;
  const {
    data: currentUserDetails,
    loading: currentUserLoading,
    error: currentUserError,
  } = useQuery(GET_USER, {
    skip: skipQuery,
    variables: { id: currentUser?.uid || "" },
  });

  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  };

  if (loading || currentUserLoading) return <Spinner />;
  if (error)
    return (
      <Text style={{ color: currentColors.text }}>Error loading carpools</Text>
    );

  return (
    <>
      <ScrollView
        style={{ backgroundColor: currentColors.background, flex: 1 }}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          {showSuccessMessage && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View style={{ flexDirection: "column", flexShrink: 1 }}>
              <Text
                style={{
                  fontFamily: "Comfortaa",
                  fontWeight: "500",
                  fontSize: 14,
                  marginBottom: -10,
                  color: currentColors.text,
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
                  color: currentColors.text,
                }}
              >
                {currentUserDetails?.getUser?.firstName || "User"}
              </Text>
            </View>

            {currentUserDetails?.getUser?.imageUrl && (
              <Image
                source={{
                  uri: currentUserDetails?.getUser?.imageUrl || undefined,
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  marginLeft: 15,
                }}
              />
            )}
          </View>
          <Text style={[styles.sectionTitle, { fontFamily: "Comfortaa-bold" }]}>
            Today’s ride
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
                    endTime={"03: 53 PM"}
                    passengerImages={[
                      vanessaChildImage,
                      evanChildImage,
                      gloriaChildImage,
                    ]}
                  />
                </Link>
              );
            }}
            horizontal={carpools.length > 1}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* <Text style={[styles.sectionTitle, { color: currentColors.text, fontFamily: "Comfortaa-bold" }]}>
          Upcoming Rides
        </Text> */}
        <FlatList
          data={uniqueRequests}
          keyExtractor={(request) => request.id}
          renderItem={({ item: request }) => (
            <View style={{ marginTop: 5, paddingHorizontal: 5 }}>
              {request.carpoolId && (
                <Link
                  href={{
                    pathname: "/trips/inProgress/[trip]",
                    params: { trip: request.carpoolId },
                  }}
                >
                  <MapDriverCard
                    id={request.carpoolId}
                    driverName={request.driver?.firstName || "User"}
                    driveCount={42}
                    driverImage={request.driver?.imageUrl || ""}
                    likes={300}
                    date={new Date()}
                    duration={"23 mins"}
                    startLocation={request.carpool?.startAddress || "Unknown"}
                    startTime={request.carpool?.departureTime || "Unknown"}
                    endLocation={request.carpool?.endAddress || "Unknown"}
                    endTime={"03:53pm"}
                    passengerImages={[
                      vanessaChildImage,
                      evanChildImage,
                      gloriaChildImage,
                    ]}
                  />
                </Link>
              )}
            </View>
          )}
          ListEmptyComponent={<Text>No requests available.</Text>}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />
        <View
          style={{ paddingHorizontal: 15, paddingBottom: 15, marginTop: -20 }}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: currentColors.text,
                fontFamily: "Comfortaa-bold",
                marginBottom: 25,
              },
            ]}
          >
            Upcoming Rides
          </Text>
          <View style={{ marginBottom: 15}}>
            <ActiveRiderCard
              id={"hjed6903"}
              state={"confirmed"}
              date={getTomorrowDate()}
              startLocation={"5897 Keith Street"}
              startTime={"3:30pm"}
              endLocation={"Richmond Olympic Oval"}
              endTime={"4:15pm"}
              images={[evanChildImage, vanessaChildImage]}
              recurrence={"one time"}
            />
          </View>
          <ActiveRiderCard
            id={"affg1684"}
            state={"confirmed"}
            date={getTomorrowDate()}
            startLocation={"5897 Keith Street"}
            startTime={"3:30pm"}
            endLocation={"Richmond Olympic Oval"}
            endTime={"4:15pm"}
            images={[evanChildImage, vanessaChildImage]}
            recurrence={"one time"}
          />
        </View>
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

export default withAuthCheck(CarpoolListScreen);
