import { Friend, FriendsWithUserInfo, User } from "@/graphql/generated";
import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

const UserProfileCard = ({ profile }: { profile: Friend }) => {
  const firstName = profile.firstName.split(" ")[0];
  const truncatedFirstName =
    firstName.length > 5 ? firstName.slice(0, 5) + ".." : firstName;

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
        source={{
          uri: profile.imageUrl ?? "https://thispersondoesnotexist.com/",
        }}
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
          // @ts-ignore
          backgroundColor: profile.status ? "#11aa00" : "#d9d9d9",
        }}
      />
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          fontFamily: "Comfortaa",
        }}
      >
        {truncatedFirstName}
      </Text>
    </View>
  );
};

const FriendsList = ({ profiles }: { profiles: FriendsWithUserInfo[] }) => (
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
      {profiles.length > 0 ? (
        profiles.map((profile) => (
          <UserProfileCard
            key={profile.friends.firstName}
            profile={profile.friends}
          />
        ))
      ) : (
        <Text>No friends available</Text>
      )}
    </ScrollView>
  </View>
);

export default FriendsList;
