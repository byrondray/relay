import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SectionList,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons
import { useTheme } from "@/contexts/ThemeContext";

interface Friend {
  id: string;
  name: string;
  source: string;
  imageUrl: string;
  showCheckmark: boolean;
}

interface FriendsListProp {
  visible: boolean;
  onClose: () => void;
}

const FriendsList: React.FC<FriendsListProp> = ({ visible, onClose }) => {
  const { currentColors } = useTheme(); // Access theme colors

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"Friends" | "Messages" | "Images">(
    "Friends"
  );

  const allFriends: Friend[] = [
    { id: "1", name: "Ally", source: "Burnaby", imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600", showCheckmark: false },
    { id: "2", name: "Amy", source: "Richmond", imageUrl: "", showCheckmark: false },
    { id: "3", name: "Andy", source: "Burnaby", imageUrl: "", showCheckmark: false },
    { id: "4", name: "Ben", source: "Richmond", imageUrl: "", showCheckmark: false },
    { id: "5", name: "Bennett", source: "Burnaby", imageUrl: "", showCheckmark: false },
    { id: "6", name: "Brandon", source: "Downtown", imageUrl: "", showCheckmark: false },
    { id: "7", name: "Cat", source: "Surrey", imageUrl: "", showCheckmark: false },
    { id: "8", name: "Coralla", source: "Vancouver", imageUrl: "", showCheckmark: false },
    { id: "9", name: "Emilia", source: "Coquitlam", imageUrl: "", showCheckmark: false },
  ];

  // Group friends by the first letter of their names
  const groupFriends = (friends: Friend[]) => {
    const grouped: { title: string; data: Friend[] }[] = [];
    const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));

    sortedFriends.forEach((friend) => {
      const firstLetter = friend.name.charAt(0).toUpperCase();
      const group = grouped.find((section) => section.title === firstLetter);

      if (group) {
        group.data.push(friend);
      } else {
        grouped.push({ title: firstLetter, data: [friend] });
      }
    });

    return grouped;
  };

  const filteredFriends = searchQuery
    ? allFriends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFriends;

  const groupedFriends = groupFriends(filteredFriends);

  const toggleSelection = (id: string) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((friendId) => friendId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={() => null}>
          <KeyboardAvoidingView
            behavior="padding"
            style={[
              styles.modalContent,
              { 
                backgroundColor: currentColors.background 
            },
            ]}
          >
            {/* Search Bar */}
            <View
              style={[
                styles.searchContainer,
                { 
                    backgroundColor: currentColors.placeholder 
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={currentColors.icon}
                style={styles.icon}
              />
              <TextInput
                    placeholder={
                        activeTab === "Friends"
                        ? "Search by friend name"
                        : "Search by text"
                    }
                    style={[
                        styles.input, 
                        { 
                            color: currentColors.text 
                        }
                    ]}
                    placeholderTextColor={currentColors.icon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    />
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
              {["Friends", "Messages", "Images"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    activeTab === tab && 
                    { 
                        borderBottomColor: currentColors.tint 
                    },
                  ]}
                  onPress={() => setActiveTab(tab as "Friends" | "Messages" | "Images")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && 
                      { 
                        color: currentColors.tint 
                    },
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
                style={[
                    styles.divider, 
                    { 
                        backgroundColor: currentColors.placeholder 
                    }
                ]}
            />
            
            {/* Conditional Rendering for Tabs */}
            {activeTab === "Friends" && (
              <SectionList style={[styles.sectionWrapper, {backgroundColor: currentColors.background, shadowColor: currentColors.text}]}
              
                sections={groupedFriends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <>
                    <TouchableOpacity 
                      style={styles.friendCard}
                      onPress={() => toggleSelection(item.id)}
                    >
                      <View style={styles.friendInfo}>
                        <View style={styles.imageContainer}>
                          {item.imageUrl ? (
                            <Image
                              source={{ uri: item.imageUrl }}
                              style={styles.friendImage}
                            />
                          ) : (
                            <Ionicons
                              name="person-circle-outline"
                              size={40}
                              color={currentColors.icon}
                            />
                          )}
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.friendName,
                              { color: currentColors.text },
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={[
                              styles.friendSource,
                              { color: currentColors.icon },
                            ]}
                          >
                            {item.source}
                          </Text>
                        </View>
                      </View>
                      {selectedFriends.includes(item.id) && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={currentColors.tint}
                        />
                      )}
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.divider, 
                        { 
                            backgroundColor: currentColors.placeholder 
                        }
                    ]}
                    />
                  </>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View>
                    <Text
                      style={[
                        styles.sectionHeader, 
                        { 
                            color: currentColors.icon 
                        }]
                    }
                    >
                      {title}
                    </Text>
                  </View>
                )}
                stickySectionHeadersEnabled={false}
              />
            )}

            {activeTab === "Messages" && (
              <View style={styles.tabContent}>
                <Text style={{ color: currentColors.text }}>
                  Messages Tab Content
                </Text>
              </View>
            )}

            {activeTab === "Images" && (
              <View style={styles.tabContent}>
                <Text style={{ color: currentColors.text }}>
                  Images Tab Content
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Comfortaa",
  },
  icon: {
    marginRight: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    borderBottomWidth: 2,
    paddingVertical: 5,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "Comfortaa",
  },
  sectionWrapper: {
    // backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginVertical: 8,
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5, 
    elevation: 10,
    },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10,
  },
  friendCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 10,
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendName: {
    fontSize: 16,
    fontFamily: "Comfortaa",
  },
  friendSource: {
    fontSize: 14,
    fontFamily: "Comfortaa",
  },
  divider: {
    height: 1,
    marginHorizontal: 10,
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendsList;
