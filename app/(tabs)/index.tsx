import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HAS_USER_ON_BOARDED } from "@/graphql/user/queries";
import { router, Href } from "expo-router";
import { auth } from "@/firebaseConfig";
import withAuthCheck from "../../components/WithAuthCheck";
import { ThemedText } from "@/components/ThemedText";

function HomeScreen() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  const hasFilledDriverInfo = false;

  const {
    data,
    // loading: onboardingLoading,
    error,
  } = useQuery(HAS_USER_ON_BOARDED, {
    skip: hasOnboarded !== null,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const storedOnboardingStatus =
          await AsyncStorage.getItem("hasOnboarded");
        const currentUserId = auth.currentUser?.uid;

        if (currentUserId === "wcBP7eHQU3XDOnkjtWQpt6qYb9z2") {
          await AsyncStorage.setItem("hasOnboarded", "false");
          router.push("/OnboardForms/parent");
          return;
        }

        if (storedOnboardingStatus !== null) {
          setHasOnboarded(storedOnboardingStatus === "true");
        } else {
          if (data && !data.hasUserOnBoarded) {
            await AsyncStorage.setItem("hasOnboarded", "false");
            router.push("/OnboardForms/parent");
          } else if (data?.hasUserOnBoarded) {
            await AsyncStorage.setItem("hasOnboarded", "true");
            setHasOnboarded(true);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, [data]);

  // if (onboardingLoading || hasOnboarded === null) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText>
          Error checking onboarding status: {error.message}
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>New Ride</Text>
        {/* <FriendsList /> */}
        {/* <MapDriverCard
          id="RN1234"
          driverName="John Doe"
          driveCount={60}
          likes={300}
          date={new Date("2024-11-17T12:30:00")}
          duration="1hr 02min (32.0km)"
          startLocation="4700 Kingsway, Burnaby, BC, V5H 4M5 "
          startTime="10:00am"
          endLocation="3700 Willingdon Ave, Burnaby, BC V5G 3H2"
          endTime="2:00pm"
          passengerImages={[
            "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
            "https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg",
            "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
          ]}
        /> */}

        <View style={styles.content}>
          <TouchableOpacity
            style={[
              styles.button,
              hasFilledDriverInfo
                ? styles.requestButton
                : styles.disabledButton,
            ]}
            disabled={!hasFilledDriverInfo}
            onPress={() => router.push("/(tabs)/Carpool/createRide")}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    hasFilledDriverInfo
                      ? styles.requestButtonText
                      : styles.disabledButtonText,
                  ]}
                >
                  I'm a driver
                </Text>
                <Text
                  style={[
                    styles.subText,
                    hasFilledDriverInfo && styles.requestSubText,
                  ]}
                >
                  I'm available to carpool other kids.
                </Text>
              </View>
              <Image
                source={require("@/assets/images/arrow-circle-right.png")}
                style={[
                  styles.arrowIcon,
                  !hasFilledDriverInfo && styles.disabledArrowIcon,
                ]}
              />
            </View>
          </TouchableOpacity>

          {!hasFilledDriverInfo && (
            <>
              <Text style={styles.signupText}>
                Interested in becoming a carpool driver to help drive kids in
                your community?
              </Text>

              <TouchableOpacity style={styles.signUpButtonContainer}>
                <LinearGradient
                  colors={["#FFA726", "#EF5350"]}
                  style={styles.signUpButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signUpButtonText}>
                    Sign up to be a Driver
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => router.push("/(tabs)/Carpool/postRequest")}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text style={styles.requestButtonText}>
                  Need a ride for my kid
                </Text>
                <Text style={styles.requestSubText}>
                  Notify me when a ride matches
                </Text>
              </View>
              <Image
                source={require("@/assets/images/arrow-circle-right.png")}
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.activeRequestText}>Active Request</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default withAuthCheck(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Comfortaa",
  },
  content: {
    flex: 1,
  },
  button: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
  },
  requestButton: {
    backgroundColor: "#F7F9FC",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderColor: "#E4E9F2",
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    fontFamily: "Comfortaa",
  },
  disabledButtonText: {
    fontSize: 18,
    color: "#aaa",
    fontFamily: "Comfortaa",
  },
  signupText: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
    fontFamily: "Comfortaa",
  },
  signUpButtonContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  signUpButton: {
    width: "90%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  signUpButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Comfortaa",
  },
  subText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
    fontFamily: "Comfortaa",
  },
  requestButtonText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Comfortaa",
  },
  requestSubText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
    fontFamily: "Comfortaa",
  },
  activeRequestText: {
    fontSize: 24,
    marginTop: 20,
    fontFamily: "Comfortaa",
  },
  arrowIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    tintColor: "#222B45",
  },
  disabledArrowIcon: {
    tintColor: "#aaa",
  },
});
