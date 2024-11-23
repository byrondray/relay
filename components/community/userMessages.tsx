import { Friend, FriendsWithUserInfo, User } from "@/graphql/generated";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";  // useTheme is used for theme context

const truncateMessage = (message: string) => {
  return message.length > 25 ? `${message.substring(0, 25)}...` : message;
};

const UserMessageCard = ({ profile }: { profile: FriendsWithUserInfo }) => {
  const { currentColors } = useTheme();  // Access the current theme colors

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: currentColors.background, shadowColor: currentColors.tint }
      ]}
    >
      <Image
        source={{
          uri: profile.friends.imageUrl ?? "https://thispersondoesnotexist.com/",
        }}
        style={styles.profileImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: currentColors.text }]}>
          {profile.friends.firstName}
        </Text>
        <Text style={[styles.message, { color: currentColors.text }]}>
          {/*truncateMessage(profile.latestMessage ?? "")*/}
        </Text>
      </View>
      <View style={styles.notificationContainer}>
        {/* If you have notifications logic, you can add it back with dynamic colors */}
        {/* {profile.notifications > 0 && (
          <Text
            style={{
              backgroundColor: "#e24949",  // This should be dynamic based on your theme
              color: "#fff",
              borderRadius: 12,
              paddingHorizontal: 6,
              paddingVertical: 2,
              fontSize: 12,
              fontFamily: "Comfortaa",
            }}
          >
            {profile.notifications}
          </Text>
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  name: {
    fontWeight: "bold",
    fontFamily: "Comfortaa",
  },
  message: {
    fontFamily: "Comfortaa",
  },
  notificationContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserMessageCard;
