import React from "react";
import { View, Image, ScrollView } from "react-native";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Input,
  Icon,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import FriendButton from "@/assets/images/friendButton.svg";
import PlusIcon from "@/assets/images/plusIcon.svg";
import AddFriendsIcon from "@/assets/images/addFriendsIcon.svg";
import SearchIcon from "@/assets/images/search.svg";
import MessageIcon from "@/assets/images/message-square.svg";
import UserMessageCard from "@/components/community/userMessages";
import FriendsList from "@/components/community/FriendsList";

const groups = [
  { id: 1, name: "Group 1", imageUrl: "https://picsum.photos/200" },
  { id: 2, name: "Group 2", imageUrl: "https://picsum.photos/200" },
  { id: 3, name: "Group 3", imageUrl: "https://picsum.photos/200" },
];

const userProfiles = [
  {
    profilePicture: "https://picsum.photos/200",
    userName: "John Doe",
    latestMessage: "Hey! Are we still on for lunch tomorrow?",
    notifications: 12,
    status: true,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Jane Smith",
    latestMessage: "Just finished the report, take a look!",
    notifications: 1,
    status: false,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Mike Johnson",
    latestMessage: "Don't forget about the meeting at 3 PM.",
    notifications: 5,
    status: false,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Mike Johnson",
    latestMessage: "Don't forget about the meeting at 3 PM.",
    notifications: 5,
    status: false,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Mike Johnson",
    latestMessage: "Don't forget about the meeting at 3 PM.",
    notifications: 5,
    status: true,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Mike Johnson",
    latestMessage: "Don't forget about the meeting at 3 PM.",
    notifications: 5,
    status: false,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Mike Johnson",
    latestMessage: "Don't forget about the meeting at 3 PM.",
    notifications: 5,
    status: true,
  },
  {
    profilePicture: "https://picsum.photos/200",
    userName: "Mike Johnson",
    latestMessage: "Don't forget about the meeting at 3 PM.",
    notifications: 5,
    status: true,
  },
];

const Sidebar = () => (
  <View>
    <Layout
      style={{
        display: "flex",
        width: 72,
        height: "84%",
        paddingVertical: 19,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(251, 104, 86, 0.3)",
        gap: 10,
        flexShrink: 0,
        borderRadius: 50,
        marginLeft: 10,
        marginTop: 19,
      }}
    >
      <Button
        style={{
          width: 48,
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          backgroundColor: "#444",
          borderRadius: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 2,
        }}
        appearance="ghost"
        accessoryLeft={() => <FriendButton width={48} height={48} />}
        onPress={() => console.log(`Friends list`)}
      />

      <View
        style={{
          width: "45%",
          height: 1,
          backgroundColor: "#555",
        }}
      />

      {groups.map((group) => (
        <Button
          key={group.id}
          style={{
            width: 48,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            borderRadius: 24,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 1,
            elevation: 4,
          }}
          appearance="ghost"
          accessoryLeft={() => (
            <Image
              source={{ uri: group.imageUrl }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
            />
          )}
          onPress={() => console.log(`Selected ${group.name}`)}
        />
      ))}
      <View
        style={{
          width: "45%",
          height: 1,
          backgroundColor: "#555",
        }}
      />
      <Button
        style={{
          width: 48,
          height: 48,
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          borderRadius: 24,
          backgroundColor: "#f5674d",
          marginVertical: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
        appearance="ghost"
        onPress={() => console.log(`Add a new group`)}
        accessoryLeft={() => <PlusIcon width={24} height={24} />}
      ></Button>
    </Layout>
    <Layout
      style={{
        width: 72,
        height: 72,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: "rgba(251, 104, 86, 0.3)",
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 10,
      }}
    >
      <Button
        style={{
          width: 48,
          height: 48,
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          borderRadius: 24,
          backgroundColor: "#f5674d",
          marginVertical: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
        appearance="ghost"
        onPress={() => console.log(`Add a new group`)}
        accessoryLeft={() => <AddFriendsIcon width={24} height={24} />}
      ></Button>
    </Layout>
  </View>
);

const Community = () => (
  <Layout style={{ flex: 1, flexDirection: "row" }}>
    <Sidebar />
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f7f9fc" }}>
      <FriendsList profiles={userProfiles} />
      <Text category="h1" style={{ marginTop: 0, fontFamily: "Comfortaa" }}>
        Friends
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 16,
          width: "100%",
        }}
      >
        <Input
          placeholder="Search"
          accessoryRight={() => <SearchIcon width={24} height={24} />}
          style={{
            flex: 1,
            marginRight: 10,
            backgroundColor: "#fff",
            borderRadius: 24,
            fontFamily: "Comfortaa",
          }}
        />

        <Button
          style={{
            width: 48,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 24,
            backgroundColor: "#f5674d",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }}
          appearance="ghost"
          onPress={() => console.log("Start new message")}
        >
          <MessageIcon width={24} height={24} />
        </Button>
      </View>
      <View style={{ marginTop: 10 }}>
        {userProfiles.map((profile, index) => (
          <UserMessageCard key={index} profile={profile} />
        ))}
      </View>
    </ScrollView>
  </Layout>
);

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Community />
    </ApplicationProvider>
  );
}
