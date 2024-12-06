import { router, Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Platform } from "react-native";
import Relay from "@/assets/images/Relay.svg";
import RelayWhite from "@/assets/images/Relay-white.svg";
import RelaySvg from "@/components/icons/RelaySvg";
import { Ionicons } from "@expo/vector-icons";

function Header() {
  const { currentColors } = useTheme();
  const isDarkMode = currentColors.background === "#181818";
  return (
    <View style={[styles.headerContainer, Platform.OS === "ios" ? { height: 86 } : { height: 60 }, isDarkMode ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }, { borderBottomWidth: 1, borderColor: "rgba(247, 176, 96, 0.4)" }]}>
      <StatusBar barStyle={ isDarkMode ? "light-content" : "dark-content" }/>
      <View style={{width: "100%", height: "100%", flexDirection: "row", backgroundColor: currentColors.barBackground }}>
        <View style={[Platform.OS === "ios" ? { marginTop: 45 } : { marginTop: 15 }, { flex: 1, flexDirection: "row", justifyContent: "center"}]}>
          <RelaySvg width={30} height={30} />
          {isDarkMode ? (
            <RelayWhite style={{ marginLeft: 10, marginTop: 5 }} />
          ) : (
            <Relay style={{ marginLeft: 10, marginTop: 5 }} />
          )}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { currentColors } = useTheme();
  const isDarkMode = currentColors.background === "#181818";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.tint,
        tabBarInactiveTintColor: currentColors.text,
        tabBarStyle: [
          styles.navContainer, 
          Platform.OS === "ios" ? { height: 88, } : { height: 70, },
          {
            backgroundColor: currentColors.tabBackground,
            borderTopColor: currentColors.placeholder,
          },
        ],
        tabBarItemStyle: [styles.navItems, Platform.OS === "ios" ? { marginTop: 5, } : { marginTop: 5, }, { height: 100, }],
        tabBarLabelStyle: [styles.navText, { color: currentColors.text, }],
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
                style={[styles.backButton, { marginLeft: 15, marginTop: 20, }]}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={currentColors.text}
                />
              </TouchableOpacity>
              <Image
                source={{
                  uri: "https://banner2.cleanpng.com/20190125/vlo/kisspng-computer-icons-icon-design-desktop-wallpaper-clip-pepsi-clipart-pinart-coca-cola-stock-photos-i-5c4ab6b0b3b732.2697186115484003047361.jpg",
                }} // the svg that Zeno gave us is the fallback option
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 5,
                }}
              />
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: currentColors.text,
                    fontFamily: "Comfortaa",
                    marginLeft: 5,
                  },
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
    borderBottomWidth: 0,
  },
  customHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    width: "100%",
    height: 100,
  },
  navText: {
    marginTop: 4,
    fontSize: 10,
  },
  backButton: {
    width: 24,
  },
  backText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  navItems: {
    flex: 1,
  },
});
