import { router, Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import Relay from "@/assets/images/Relay.svg";
import RelayWhite from "@/assets/images/Relay-white.svg";
import { Ionicons } from "@expo/vector-icons";

function Header() {
  const { currentColors } = useTheme();
  const isDarkMode = currentColors.background === "#181818";
  return (
    <View
      style={[
        styles.headerContainer,
        {
          borderBottomColor: currentColors.placeholder,
          backgroundColor: currentColors.placeholder,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/RelayLogo.png")}
        style={{ width: 30 }}
      />
      {isDarkMode ? (
        <RelayWhite style={{ marginLeft: 5 }} />
      ) : (
        <Relay style={{ marginLeft: 5 }} />
      )}
    </View>
  );
}

export default function TabLayout() {
  const { currentColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.tint,
        tabBarInactiveTintColor: currentColors.text,
        tabBarStyle: [
          styles.navContainer,
          {
            backgroundColor: currentColors.background,
            borderTopColor: currentColors.placeholder,
          },
        ],
        tabBarLabelStyle: [styles.navText, { color: currentColors.text }],
        headerShown: true,
        header: () => <Header />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="temp"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "paper-plane" : "paper-plane-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chooseRide"
        options={{
          title: "New Ride",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Community/community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "cog" : "cog-outline"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Carpool/postRequest"
        options={{
          title: "Post Request",
          href: null,
        }}
      />

      <Tabs.Screen
        name="Carpool/selectPassenger"
        options={{
          title: "Message",
          href: null,
        }}
      />

      <Tabs.Screen
        name="Carpool/selectPassengerList"
        options={{
          title: "Message",
          href: null,
        }}
      />

      <Tabs.Screen
        name="messages/[userId]"
        options={{
          href: null,
          headerShown: true,
          header: ({ navigation, route }) => (
            <View
              style={[
                styles.customHeaderContainer,
                { backgroundColor: currentColors.background },
              ]}
            >
              {/* Back Button */}
              <TouchableOpacity
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.push("/Community/community")
                }
                style={styles.backButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={currentColors.text}
                />
              </TouchableOpacity>

              {/* Centered Name */}
              <Text
                style={[
                  styles.headerTitle,
                  { color: currentColors.text, fontFamily: "Comfortaa" },
                ]}
              >
                {route.params?.recipientName || "Message"}
              </Text>

              <View style={{ width: 24 }} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="trips/inProgress/[trip]"
        options={{
          title: "Message",
          href: null,
        }}
      />

      <Tabs.Screen
        name="trips/listcarpool"
        options={{
          title: "Message",
          href: null,
        }}
      />

      <Tabs.Screen
        name="messages/group/[groupId]"
        options={{
          headerShown: true,
          href: null,
          header: ({ route }) => (
            <View
              style={[
                styles.customHeaderContainer,
                { backgroundColor: currentColors.background },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.push("/Community/community")
                }
                style={styles.backButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={currentColors.text}
                />
              </TouchableOpacity>

              <Text
                style={[
                  styles.headerTitle,
                  { color: currentColors.text, fontFamily: "Comfortaa" },
                ]}
              >
                {route.params?.groupName || "Group"}
              </Text>

              <View style={{ width: 24 }} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Carpool/NewRide"
        options={{
          title: "NewRide",
          href: null,
        }}
      />

      <Tabs.Screen
        name="Carpool/createRide"
        options={{
          title: "NewRide",
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    height: 50,
  },
  customHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between for alignment
    paddingHorizontal: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Optional for border
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    width: "100%",
  },
  navText: {
    fontSize: 12,
  },
  backButton: {
    width: 24, // Fixed size for consistent alignment
  },
  backText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1, // Ensures centering in the available space
  },
});
