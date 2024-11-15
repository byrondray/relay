import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View, Image } from "react-native";
import Relay from "@/assets/images/Relay.svg";

function Header() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("@/assets/images/RelayLogo.png")}
        style={{ width: 30 }}
      />
      <Relay style={{ marginLeft: 5 }} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff9900",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: styles.navContainer,
        tabBarLabelStyle: styles.navText,
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
        name="Carpool/postRequest"
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
        name="Carpool/createRide"
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
        name="Carpool/selectPassenger"
        options={{
          title: "Message",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="Carpool/selectPassengerList"
        options={{
          title: "Message",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="messages/[userId]"
        options={{
          title: "Message",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="messages/group/[groupId]"
        options={{
          title: "Message",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="Carpool/NewRide"
        options={{
          title: "NewRide",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="temp"
        options={{
          title: "Message",
          tabBarButton: () => null,
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
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#777",
  },
  activeNavText: {
    color: "#ff9900",
  },
});
