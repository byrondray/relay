import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

interface Profile {
  profilePicture: string;
  userName: string;
  notifications: number;
  status: boolean;
}

const UserProfileCard = ({ profile }: { profile: Profile }) => {
  const firstName = profile.userName.split(" ")[0];

  return (
    <View
      style={{
        marginHorizontal: 10,
      }}
    >
      <Image
        source={{ uri: profile.profilePicture }}
        style={{
          width: 48,
          height: 48,
          borderRadius: 30,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          width: 7,
          height: 7,
          borderRadius: 5,
          backgroundColor: profile.status ? "#11aa00" : "#d9d9d9",
        }}
      />
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {firstName}
      </Text>
    </View>
  );
};

const FriendsList = ({ profiles }: { profiles: Profile[] }) => (
  <View>
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        paddingTop: 25,
        paddingBottom: 10,
      }}
    >
      {profiles.map((profile) => (
        <UserProfileCard key={profile.userName} profile={profile} />
      ))}
    </ScrollView>
  </View>
);

export default FriendsList;
