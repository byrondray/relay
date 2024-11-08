import React from "react";
import { View, Text, Image } from "react-native";

interface Profile {
  profilePicture: string;
  userName: string;
  latestMessage: string;
  notifications: number;
}
const truncateMessage = (message: string) => {
  return message.length > 25 ? `${message.substring(0, 25)}...` : message;
};

const UserMessageCard = ({ profile }: { profile: Profile }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 40,
      marginTop: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    }}
  >
    <Image
      source={{ uri: profile.profilePicture }}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
      }}
    />
    <View style={{ flex: 1 }}>
      <Text style={{ fontWeight: "bold", fontFamily: "Comfortaa" }}>
        {profile.userName}
      </Text>
      <Text style={{ color: "#666", fontFamily: "Comfortaa" }}>
        {truncateMessage(profile.latestMessage)}
      </Text>
    </View>
    <View
      style={{ marginLeft: 10, justifyContent: "center", alignItems: "center" }}
    >
      {profile.notifications > 0 && (
        <Text
          style={{
            backgroundColor: "#e24949",
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
      )}
    </View>
  </View>
);

export default UserMessageCard;
