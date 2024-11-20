import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Input,
  Spinner,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import FriendButton from "@/assets/images/friendButton.svg";
import PlusIcon from "@/assets/images/plusIcon.svg";
import AddFriendsIcon from "@/assets/images/addFriendsIcon.svg";
import SearchIcon from "@/assets/images/search.svg";
import MessageIcon from "@/assets/images/message-square.svg";
import UserMessageCard from "@/components/community/userMessages";
import FriendsList from "@/components/community/FriendsList";
import { GET_GROUPS } from "@/graphql/group/queries";
import { useQuery } from "@apollo/client";
import { FriendsWithUserInfo, Group } from "@/graphql/generated";
import groupIcon from "@/assets/images/group-icon.svg";
import { GET_FRIENDS } from "@/graphql/friends/queries";
import * as ImagePicker from "expo-image-picker";
import FriendsExpandablePanel from "@/components/community/AddFriends";
import ImageUpload from "@/components/carpool/uploadImageInput";
import InviteFriendDropdown from "@/components/community/InviteFriends";
import FriendsInviteDescription from "@/components/community/friendsDescription";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useFocusEffect } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import FriendProfile from "@/components/FriendProfile";
import FriendCard from "@/components/FriendCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useTextSize } from "@/contexts/TextSizeContext";


const Sidebar = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  const {
    data: groupsData,
    error,
    loading,
  } = useQuery(GET_GROUPS, {
    onCompleted: (data) => {
      console.log(data, "groups");
      setGroups(data.getGroups);
    },
  });
  const { currentColors } = useTheme();
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <View style={{ backgroundColor: currentColors.background}}>
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
          <Link
            key={group.id}
            href={{
              pathname: "/messages/group/[groupId]",
              params: { groupId: group.id },
            }}
            asChild
          >
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
                  source={{
                    uri:
                      group.imageUrl ??
                      "https://banner2.cleanpng.com/20190125/vlo/kisspng-computer-icons-icon-design-desktop-wallpaper-clip-pepsi-clipart-pinart-coca-cola-stock-photos-i-5c4ab6b0b3b732.2697186115484003047361.jpg",
                  }} // the svg that Zeno gave us is the fallback option
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              )}
              onPress={() => console.log(`Selected ${group.name}`)}
            />
          </Link>
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
};

const Community = () => {
  const [friends, setFriends] = useState<FriendsWithUserInfo[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [groupIcon, setGroupIcon] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleInvite = (email: string) => {
    console.log(`Invite sent to: ${email}`);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setGroupIcon(result.assets[0].uri);
    }
  };
  const {
    data: friendsData,
    loading,
    error,
    refetch
  } = useQuery(GET_FRIENDS, {
    onCompleted: (data) => {
      console.log(data, "friends");
      setFriends(data.getFriends);
    },
  });

  useFocusEffect(
  useCallback(() => {
    refetch();
  }, [refetch])
);

  const [searchText, setSearchText] = useState("");
  const textColor = useThemeColor({}, "placeholder");

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner />
      </View>
    );
  }
  const { currentColors } = useTheme();
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <Layout style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar />
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: currentColors.background }}>
        <FriendsList profiles={friends} />
        <Text category="h1" style={{ marginTop: 0, fontFamily: "Comfortaa", color: currentColors.text, fontSize: 32 * textScaleFactor }}>
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
              backgroundColor: currentColors.placeholder,
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
            onPress={() => setIsPanelVisible(true)}
          >
            <MessageIcon width={24} height={24} />
          </Button>
        </View>
        <FriendsExpandablePanel
          isVisible={isPanelVisible}
          onClose={() => setIsPanelVisible(false)}
        >
          <Text
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontFamily: "Comfortaa",
              fontSize: 22 * textScaleFactor,
              color: currentColors.text
            }}
          >
            Create New Group
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa",
              color: currentColors.text,
              fontSize: 12 * textScaleFactor,
              marginBottom: 15,
            }}
          >
            Members Invited
          </Text>
          <ScrollView
            horizontal={true}
            style={{ marginLeft: 5, marginBottom: 10 }}
          >
            <FriendProfile
              id={""}
              name={"Bob"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
            <FriendProfile
              id={""}
              name={"Bob"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
            <FriendProfile
              id={""}
              name={"Bob"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
          </ScrollView>
          <Input
            placeholder="Group Name"
            style={{
              backgroundColor: currentColors.background,
              borderRadius: 24,
              fontFamily: "Comfortaa",
            }}
          ></Input>

          <Text
            style={{
              marginBottom: 10,
              marginTop: 15,
              fontSize: 12 * textScaleFactor,
              color: currentColors.text,
              fontFamily: "Comfortaa",
            }}
          >
            Group Icon
          </Text>
          <ImageUpload profileImage={groupIcon} pickImage={pickImage} />
          <InviteFriendDropdown onInvite={handleInvite} />
          <FriendsInviteDescription
            description={description}
            setDescription={setDescription}
          />
          <Button
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
              marginTop: 10,
              width: 130,
              height: 25,
              paddingTop: 10,
              justifyContent: "center",
              paddingHorizontal: 10,
              backgroundColor: currentColors.tint,
              borderRadius: 24,
              borderWidth: 0,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa", color: currentColors.text }}>
              Invite friend
            </Text>
          </Button>
          <Text
            style={{
              marginTop: 10,
              marginBottom: 10,
              fontFamily: "Comfortaa",
              fontSize: 18 * textScaleFactor,
              color: currentColors.text
            }}
          >
            Select From Friend List
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: currentColors.background,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 16,
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color={currentColors.icon}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={{ flex: 1, height: 20, fontFamily: "Comfortaa" }}
              placeholder="Search friend by name or email address"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <ScrollView
            style={{
              borderColor: "#8F9BB333",
              borderWidth: 2,
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <FriendCard
              id={""}
              name={"Bob"}
              source={"Basketball"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
            <FriendCard
              id={""}
              name={"Bob"}
              source={"Basketball"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
            <FriendCard
              id={""}
              name={"Bob"}
              source={"Basketball"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
            <FriendCard
              id={""}
              name={"Bob"}
              source={"Basketball"}
              imageUrl={"https://thispersondoesnotexist.com/"}
            />
          </ScrollView>
        </FriendsExpandablePanel>
        <View style={{ marginTop: 10 }}>
          {friends.length > 0 ? (
            friends.map((profile, index) => (
              <TouchableOpacity
                key={profile.friends.id}
                onPress={() => {
                  router.push(`/messages/${profile.friends.id}`);
                }}
              >
                <UserMessageCard key={index} profile={profile} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: currentColors.text, fontFamily: "Comfortaa", fontSize: 14 * textScaleFactor }}>
              No friends available
            </Text>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Community />
    </ApplicationProvider>
  );
}