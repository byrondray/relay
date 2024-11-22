import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons
import { useTheme } from "@/contexts/ThemeContext";
import FriendCard from "@/components/FriendCard";

interface InviteScreenProps {
  visible: boolean;
  onClose: () => void;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ visible, onClose }) => {
  const { currentColors } = useTheme(); // Access theme colors

  // Sample data for friends
  const allFriends = [
    { id: "1", name: "Ally", source: "Burnaby", imageUrl: "", showCheckmark: false },
    { id: "2", name: "Amy", source: "Richmond", imageUrl: "", showCheckmark: false },
    { id: "3", name: "Byron", source: "Downtown", imageUrl: "", showCheckmark: false },
    { id: "4", name: "Emilia", source: "Coquitlam", imageUrl: "", showCheckmark: false },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(allFriends);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allFriends.filter((friend) =>
      friend.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  // Handle email validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(value));
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
          {/* Avoid closing modal when touching content */}
          <TouchableWithoutFeedback onPress={() => null}>
            <KeyboardAvoidingView behavior="padding" style={[
              styles.modalContent, 
              {
                backgroundColor: currentColors.background
                }]}>
              <Text style={[
                styles.header, 
                { 
                  color: currentColors.text 
                }]}>
                Invite Your Friends to Join
              </Text>
              <View
                  style={[
                    styles.sectionLine, 
                    { 
                      borderColor: currentColors.placeholder 
                    }]}
                />

              {/* Invite by Email Section */}
              <View style={styles.section}>
                <Text style={[
                  styles.sectionTitle, 
                  {
                     color: currentColors.icon 
                  }]}>
                  Invite a Friend By Email
                </Text>
                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: currentColors.placeholder 
                  }]}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={currentColors.icon}
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="Email Address"
                    style={[
                      styles.input,
                      { 
                        color: currentColors.text 
                      },
                    ]}
                    placeholderTextColor={currentColors.icon}
                    value={email}
                    onChangeText={handleEmailChange}
                  />
                </View>
                {!isValidEmail && (
                  <Text style={[
                    styles.errorText, 
                    { 
                      color: currentColors.tint 
                    }]}>
                    Please enter a valid email address.
                  </Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.inviteButton, 
                    { 
                      backgroundColor: currentColors.tint 
                    }]}
                  onPress={() => {
                    if (isValidEmail && email.trim() !== "") {
                      
                      setEmail("");
                    }
                  }}
                >
                  <Text style={styles.inviteButtonText}>Invite friend</Text>
                </TouchableOpacity>
              </View>

              {/* Add Friends Section */}
              <View style={styles.section}>
                <Text style={[
                  styles.header, 
                  { 
                    color: currentColors.text 
                    }]}>
                  Add Friends
                </Text>
                <View
                  style={[
                    styles.sectionLine, 
                    { 
                      borderColor: currentColors.placeholder 
                    }]}
                />
                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: currentColors.placeholder 
                  }]}>
                  <Ionicons
                    name="search-outline"
                    size={18}
                    color={currentColors.icon}
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="Add friend by name or email"
                    style={[
                      styles.input,
                      { 
                        color: currentColors.text 
                      },
                    ]}
                    placeholderTextColor={currentColors.icon}
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                </View>
                <ScrollView style={styles.friendList}>
                  {filteredFriends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      id={friend.id}
                      name={friend.name}
                      source={friend.source}
                      imageUrl={friend.imageUrl}
                      showCheckmark={friend.showCheckmark}
                    />
                  ))}
                </ScrollView>
              </View>

              
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
    // backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "95%",
  },
  header: {
    fontSize: 20,
    fontFamily: "Comfortaa",
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    marginBottom: 10,
  },
  sectionLine: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    borderWidth: 1,
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
  inviteButton: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
  },
  inviteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Comfortaa",
  },
  friendList: {
    marginTop: 10,
    maxHeight: "65%",
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
  },
});


export default InviteScreen;
