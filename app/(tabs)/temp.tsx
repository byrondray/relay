import DriverPost from "@/components/trips/driverPost";
import MyHistory from "@/components/trips/myHistory";
import MySchedule from "@/components/trips/mySchedule";
import RideRequest from "@/components/trips/rideRequests";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        {["My Schedule", "Ride Requests", "Driver Post", "My History"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleNavigation(item)}
              style={styles.navTouchable} // Increased touchable area
            >
              <View style={styles.navItem}>
                <Text
                  style={[
                    styles.navText,
                    {
                      color:
                        currentPage === item ? "#FF6A00" : currentColors.text,
                    },
                  ]}
                >
                  {item}
                </Text>
                {currentPage === item && (
                  <View
                    style={[styles.activeLine, { backgroundColor: "#FF6A00" }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          )
        )}
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
  navTouchable: {
    paddingVertical: 10,
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
});
