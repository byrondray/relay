import { Friend, FriendsWithUserInfo } from "@/graphql/generated";
import { Link } from "expo-router";
import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme hook

const UserProfileCard = ({ profile }: { profile: Friend }) => {
  const { currentColors } = useTheme(); // Access the current theme colors
  const firstName = profile.firstName.split(" ")[0];
  const truncatedFirstName =
    firstName.length > 5 ? firstName.slice(0, 5) + ".." : firstName;

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: currentColors.background, shadowColor: currentColors.tint }, // Dynamic background color
      ]}
    >
      <Image
        source={{
          uri: profile.imageUrl ?? "https://thispersondoesnotexist.com/",
        }}
        style={styles.profileImage}
      />
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: currentColors.background ? "#11aa00" : "#d9d9d9" }, // Status indicator color
        ]}
      />
      <Text style={[styles.profileName, { color: currentColors.text }]}>
        {truncatedFirstName}
      </Text>
    </View>
  );
};

const FriendsList = ({ profiles }: { profiles: FriendsWithUserInfo[] }) => {
  const { currentColors } = useTheme(); // Access the current theme colors

  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: currentColors.background }, // Dynamic background color for the scroll view
        ]}
      >
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <Link
              key={profile.friends.id}
              href={{
                pathname: "/messages/[userId]",
                params: { userId: profile.friends.id },
              }}
              asChild
            >
              <UserProfileCard profile={profile.friends} />
            </Link>
          ))
        ) : (
          <Text style={{ color: currentColors.background }}>No friends available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 8,
    paddingHorizontal: 15,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 30,
  },
  statusIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 5,
  },
  profileName: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Comfortaa",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingTop: 25,
    paddingBottom: 10,
  },
});

export default FriendsList;
