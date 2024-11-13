// InviteFriendDropdown.tsx
import React, { useState } from "react";
import { Layout, Text, Input } from "@ui-kitten/components";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import EmailIcon from "@/assets/images/email.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { text } from "express";

interface InviteFriendDropdownProps {
  onInvite: (email: string) => void;
}

const InviteFriendDropdown = ({ onInvite }: InviteFriendDropdownProps) => {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");

  const textColor = useThemeColor({}, "placeholder");
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
          style={[styles.input, { color: textColor }]}
          accessoryLeft={() => (
            <EmailIcon style={{ width: 20, height: 20, marginLeft: 10 }} />
          )}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => onInvite(email)}
        >
          <Text style={styles.sendButtonText}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Layout>
      <TouchableOpacity style={styles.button} onPress={toggleExpand}>
        <Text style={[styles.buttonText, { color: textColor, fontSize: 12 }]}>
          Invite a Friend by Email
        </Text>
        <Text style={[styles.expandIcon, { color: textColor }]}>
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
    backgroundColor: "#FB812A",
    alignItems: "center",
  },
  sendButtonText: {
    fontFamily: "Comfortaa",
    fontSize: 16,
    color: "#FFF",
  },
});

export default InviteFriendDropdown;
