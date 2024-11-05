import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const NewRideScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>New Ride</Text>

        <TouchableOpacity style={styles.disabledButton} disabled>
          <View style={styles.buttonContent}>
            <View style={styles.textContainer}>
              <Text style={styles.disabledButtonText}>I'm a driver</Text>
              <Text style={styles.subText}>I'm available to carpool kids.</Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={[styles.arrowIcon, { tintColor: "#aaa" }]}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Interested in becoming a carpool driver to help drive kids in your
          community?
        </Text>

        <TouchableOpacity style={styles.signUpButtonContainer}>
          <LinearGradient
            colors={["#FFA726", "#EF5350"]}
            style={styles.signUpButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signUpButtonText}>Sign up to be a Driver</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.requestButton}>
          <View style={styles.buttonContent}>
            <View style={styles.textContainer}>
              <Text style={styles.requestButtonText}>
                Need a ride for my kid
              </Text>
              <Text style={styles.subText}>Notify me when a ride matches</Text>
            </View>
            <Image
              source={require("@/assets/images/arrow-circle-right.png")}
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.activeRequestText}>Active Request</Text>
      </View>

      <View style={styles.navBarContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  disabledButtonText: {
    fontSize: 18,
    color: "#aaa",
  },
  subText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  signupText: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
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
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  requestButtonText: {
    fontSize: 18,
    color: "#333",
  },
  activeRequestText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  navBarContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  arrowIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

export default NewRideScreen;
