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
import { router } from "expo-router";
import { auth } from "@/firebaseConfig";
import withAuthCheck from "../../components/WithAuthCheck";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/contexts/ThemeContext";

function HomeScreen() {
  const { currentColors } = useTheme();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const hasFilledDriverInfo = true;

  const { data, error } = useQuery(HAS_USER_ON_BOARDED, {
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
    <ScrollView style={{ height: "100%" }}>
      <View
        style={[
          styles.container,
          { backgroundColor: currentColors.background },
        ]}
      >
        <Text style={[styles.title, { color: currentColors.text }]}>
          New Ride
        </Text>

        <View style={styles.content}>
          <TouchableOpacity
            style={[
              styles.requestButton,
              {
                borderColor: currentColors.tint,
                backgroundColor: currentColors.background,
              },
              !hasFilledDriverInfo && styles.disabledButton, // Apply disabled styles conditionally
            ]}
            disabled={!hasFilledDriverInfo} // Disable button if hasFilledDriverInfo is false
            onPress={() => router.push("/(tabs)/Carpool/createRide")}
          >
            <View style={[styles.buttonContent]}>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.requestButtonText,
                    { color: currentColors.text },
                  ]}
                >
                  I'm a driver
                </Text>
                <Text
                  style={[styles.requestSubText, { color: currentColors.text }]}
                >
                  I'm available to carpool other kids.
                </Text>
              </View>
              <Image
                source={require("@/assets/images/arrow-circle-right.png")}
                style={[
                  styles.arrowIcon,
                  !hasFilledDriverInfo && styles.disabledArrowIcon, // Adjust arrow icon based on disabled state
                ]}
              />
            </View>
          </TouchableOpacity>

          {!hasFilledDriverInfo && (
            <>
              <Text style={[styles.signupText, { color: currentColors.text }]}>
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
            style={[
              styles.requestButton,
              {
                borderColor: currentColors.tint,
                backgroundColor: currentColors.background,
              },
            ]}
            onPress={() => router.push("/(tabs)/Carpool/postRequest")}
          >
            <View style={styles.buttonContent}>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.requestButtonText,
                    { color: currentColors.text },
                  ]}
                >
                  Need a ride for my kid
                </Text>
                <Text
                  style={[styles.requestSubText, { color: currentColors.text }]}
                >
                  Notify me when a ride matches
                </Text>
              </View>
              <Image
                source={require("@/assets/images/arrow-circle-right.png")}
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>

          <Text
            style={[styles.activeRequestText, { color: currentColors.text }]}
          >
            Active Request
          </Text>
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
    justifyContent: "space-between",
    height: "100%",
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
    // backgroundColor: "#f0f0f0",
  },
  requestButton: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
    fontFamily: "Comfortaa",
  },
  signupText: {
    fontSize: 14,
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
    fontWeight: "bold",
    fontFamily: "Comfortaa",
  },
  subText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: "Comfortaa",
  },
  requestButtonText: {
    fontSize: 18,
    fontFamily: "Comfortaa",
  },
  requestSubText: {
    fontSize: 14,
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
