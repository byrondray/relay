import React, { useState } from "react";
import { Layout, Text, Input } from "@ui-kitten/components";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import EmailIcon from "@/assets/images/email.svg";
import { useTheme } from "@/contexts/ThemeContext";  // useTheme is used for theme context

interface InviteFriendDropdownProps {
  onInvite: (email: string) => void;
}

const InviteFriendDropdown = ({ onInvite }: InviteFriendDropdownProps) => {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");

  const { currentColors } = useTheme();  // Access the current theme colors
  const textColor = currentColors.text;  // Get the text color from theme
  const buttonBackgroundColor = currentColors.tint;  // Updated to use the theme tint color

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const renderInviteContent = () => {
    return (
      <View style={styles.inviteContent}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Friend's email"
          style={[styles.input, { color: textColor, borderColor: currentColors.tint }]}
          accessoryLeft={() => (
            <EmailIcon style={{ width: 20, height: 20, marginLeft: 10 }} />
          )}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: buttonBackgroundColor }]}
          onPress={() => onInvite(email)}
        >
          <Text style={[styles.sendButtonText, { color: "#fff" }]}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Layout>
      <TouchableOpacity style={styles.button} onPress={toggleExpand}>
        <Text style={[styles.buttonText, { color: currentColors.text, fontSize: 12 }]}>
          Invite a Friend by Email
        </Text>
        <Text style={[styles.expandIcon, { color: currentColors.text }]}>
          {expanded ? "-" : "+"}
        </Text>
      </TouchableOpacity>
      {expanded && renderInviteContent()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "transparent", // mimics the "ghost" appearance
  },
  buttonText: {
    fontFamily: "Comfortaa",
    fontSize: 16,
  },
  expandIcon: {
    fontFamily: "Comfortaa",
    fontSize: 16,
  },
  inviteContent: {},
  input: {
    borderWidth: 1,
    borderRadius: 24,
    fontFamily: "Comfortaa",
    marginBottom: 20,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    alignItems: "center",
  },
  sendButtonText: {
    fontFamily: "Comfortaa",
    fontSize: 16,
  },
});

export default InviteFriendDropdown;
