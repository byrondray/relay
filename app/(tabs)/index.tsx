import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ScrollView,
  Image,
  Platform,
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
import { LinearGradient } from "expo-linear-gradient";
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
        <LinearGradient
          colors={[currentColors.gradient[0], currentColors.gradient[1]]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }} // Diagonal gradient
        >
          <View style={{ marginTop: 20 }}>

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
                paddingHorizontal: 16,
                padding: 20,
                paddingBottom: 30,
                height: 50,
              }}
            >

              {currentUserDetails?.getUser?.imageUrl && (
                <Image
                  source={{
                    uri: currentUserDetails?.getUser?.imageUrl || undefined,
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    marginRight: 15,
                  }}
                />
              )}

              <View style={{ height: 50, justifyContent: "center", flexDirection: "column", flex: 1 }}>
                <Text
                  style={[ Platform.OS === "ios" ? { marginBottom: 2 } : { marginBottom: -5}, {
                    fontFamily: "ComfortaaMedium",
                    fontWeight: "500",
                    fontSize: 14,
                    // marginTop: 20,
                    // marginBottom: -10,
                    color: currentColors.text,
                  }]}
                >
                  {timeOfDay}
                </Text>
                <Text
                  style={[ Platform.OS === "ios" ? { marginBottom: 2 } : { marginTop: 8, lineHeight: 24}, {
                    fontFamily: "ComfortaaBold",
                    fontSize: 24,
                    // marginBottom: 16,
                    // marginTop: 10,
                    color: currentColors.text,
                  }]}
                >
                  {currentUserDetails?.getUser?.firstName || "User"}
                </Text>
              </View>
            </View>
            <Text style={[styles.sectionTitle, { fontFamily: "ComfortaaBold", fontWeight: 600, paddingHorizontal: 16, fontSize: 28, letterSpacing: -0.5, color: currentColors.text }]}>Today's ride</Text>
            <FlatList
              data={carpools}
              style={{ borderRadius: 0, paddingLeft: 16, marginTop: 0, }}
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
              <View style={{ marginTop: 0, paddingHorizontal: 0 }}>
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
            contentContainerStyle={{ paddingLeft: 16, paddingBottom: 20 }}
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
                  fontFamily: "ComfortaaBold",
                  marginBottom: 15,
                },
              ]}
            >
              Upcoming Rides
            </Text>
            <View style={{ marginBottom: 15 }}>
              <ActiveRiderCard
                id={"HJED6903"}
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
        </LinearGradient>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
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
    fontFamily: "ComfortaaBold",
    fontSize: 28,
    letterSpacing: -0.5,
    marginTop: 30,
    marginBottom: 10,
    marginVertical: 16,
    marginLeft: 8,
  },
});

export default withAuthCheck(CarpoolListScreen);
