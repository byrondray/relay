import DriverPost from "@/components/trips/driverPost";
import MyHistory from "@/components/trips/myHistory";
import MySchedule from "@/components/trips/mySchedule";
import RideRequest from "@/components/trips/rideRequests";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    <ScrollView>
      <View
        style={{
          flex: 1,
          marginTop: 0,
          backgroundColor: currentColors.background,
        }}
      >
        {/* Navigation Row */}
        <ScrollView
          nestedScrollEnabled={true} // Allows smooth scrolling within nested structures
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={true} // Optional: Show horizontal scroll indicator
          contentContainerStyle={{
            width: "150%",
            paddingRight: "25%",
            flexDirection: "row", // Align children horizontally
            alignItems: "flex-start", // Center items vertically
            justifyContent: "flex-start", // Align children to the start horizontally
            paddingHorizontal: 10, // Add some padding for better spacing
          }}
        >
          {["My Schedule", "Ride Requests", "Driver Post", "My History"].map(
            (item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleNavigation(item)}
                style={[styles.navTouchable, { width: "30%", }]} // Increased touchable area
              >
                <View style={[styles.navItem, { width: "90%", }]}>
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
                      style={[
                        styles.activeLine,
                        { backgroundColor: "#FF6A00" },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
        <View style={{ marginBottom: 20 }}>{renderPageContent()}</View>
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  navRow: {
    flexDirection: "row",
    // justifyContent: "space-around",
    // alignItems: "center",
    marginBottom: 20,
  },
  navTouchable: {
    paddingVertical: 10,
  },
  navItem: {
    width: 190,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 14,
    fontFamily: "ComfortaaMedium",
    fontWeight: "500",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  activeLine: {
    width: "100%",
    height: 2,
    marginTop: 5,
  },
});
