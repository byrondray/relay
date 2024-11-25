import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MySchedule from "@/components/trips/mySchedule";
import RideRequest from "@/components/trips/rideRequests";
import DriverPost from "@/components/trips/driverPost";
import MyHistory from "@/components/trips/myHistory";

function HomeScreen() {
  const { currentColors } = useTheme();

  const [currentPage, setCurrentPage] = useState("My Schedule");

  const handleNavigation = (page: React.SetStateAction<string>) => {
    setCurrentPage(page);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "My Schedule":
        return <MySchedule />;
      case "Ride Requests":
        return <RideRequest />;
      case "Driver Post":
        return <DriverPost />;
      case "My History":
        return <MyHistory />;
      default:
        return <MySchedule />;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        marginTop: 0,
        backgroundColor: currentColors.background,
      }}
    >
      {/* Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => handleNavigation("My Schedule")}>
          <View style={styles.navItem}>
            <Text
              style={[
                styles.navText,
                {
                  color:
                    currentPage === "My Schedule"
                      ? "#FF6A00"
                      : currentColors.text,
                },
              ]}
            >
              My Schedule
            </Text>

            {currentPage === "My Schedule" && (
              <View
                style={[styles.activeLine, { backgroundColor: "#FF6A00" }]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation("Ride Requests")}>
          <View style={styles.navItem}>
            <Text
              style={[
                styles.navText,
                {
                  color:
                    currentPage === "Ride Requests"
                      ? "#FF6A00"
                      : currentColors.text,
                },
              ]}
            >
              Ride Requests
            </Text>
            {currentPage === "Ride Requests" && (
              <View
                style={[styles.activeLine, { backgroundColor: "#FF6A00" }]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation("Driver Post")}>
          <View style={styles.navItem}>
            <Text
              style={[
                styles.navText,
                {
                  color:
                    currentPage === "Driver Post"
                      ? "#FF6A00"
                      : currentColors.text,
                },
              ]}
            >
              Driver Post
            </Text>
            {currentPage === "Driver Post" && (
              <View
                style={[styles.activeLine, { backgroundColor: "#FF6A00" }]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation("My History")}>
          <View style={styles.navItem}>
            <Text
              style={[
                styles.navText,
                {
                  color:
                    currentPage === "My History"
                      ? "#FF6A00"
                      : currentColors.text,
                },
              ]}
            >
              My History
            </Text>
            {currentPage === "My History" && (
              <View
                style={[styles.activeLine, { backgroundColor: "#FF6A00" }]}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 20 }}>{renderPageContent()}</View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    fontFamily: "Comfortaa",
    fontWeight: "500",
    textAlign: "center",
  },
  activeLine: {
    width: "100%",
    height: 2,
    marginTop: 5,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
