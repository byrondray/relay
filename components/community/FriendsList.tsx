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
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingBottom: 8,
        paddingHorizontal: 15,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 2,
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
          top: 10,
          right: 10,
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
