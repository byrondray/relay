import React from "react";
import { View, Image } from "react-native";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import FriendButton from "@/assets/images/friendButton.svg";
import PlusIcon from "@/assets/images/plusIcon.svg";

const groups = [
  { id: 1, name: "Group 1", imageUrl: "https://picsum.photos/200" },
  { id: 2, name: "Group 2", imageUrl: "https://picsum.photos/200" },
  { id: 3, name: "Group 3", imageUrl: "https://picsum.photos/200" },
];

const Sidebar = () => (
  <Layout
    style={{
      display: "flex",
      width: 72,
      height: 630,
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
        shadowRadius: 4,
        elevation: 4,
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
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
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
);

const Community = () => (
  <Layout style={{ flex: 1, flexDirection: "row" }}>
    <Sidebar />
    <Layout style={{ flex: 1, padding: 16, backgroundColor: "#f7f9fc" }}>
      <Text category="h1">Welcome to the Community!</Text>
    </Layout>
  </Layout>
);

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Community />
    </ApplicationProvider>
  );
}
