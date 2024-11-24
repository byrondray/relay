import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, View, Image } from "react-native";
import Relay from "@/assets/images/Relay.svg";
import RelayWhite from "@/assets/images/Relay-white.svg";

function Header() {
  const { currentColors } = useTheme();
  const isDarkMode = currentColors.background === "#181818";
  return (
    <View
      style={[
        styles.headerContainer,
        {
          borderBottomColor: currentColors.background,
          backgroundColor: currentColors.background,
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
          title: "Message",
          href: null,
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
          title: "Message",
          href: null,
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
  navContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    width: "100%",
  },
  navText: {
    fontSize: 12,
  },
});
