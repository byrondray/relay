// InviteFriendDropdown.tsx
import React, { useState } from "react";
import { Layout, Text, Input } from "@ui-kitten/components";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import EmailIcon from "@/assets/images/email.svg";

interface InviteFriendDropdownProps {
  onInvite: (email: string) => void;
}

const InviteFriendDropdown = ({ onInvite }: InviteFriendDropdownProps) => {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");

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
          style={styles.input}
          accessoryLeft={() => <EmailIcon style={{ width: 20, height: 20, marginLeft: 10 }} />}
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
        <Text style={styles.buttonText}>Invite a Friend by Email</Text>
        <Text style={styles.expandIcon}>{expanded ? "-" : "+"}</Text>
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
    color: "#222B45",
  },
  expandIcon: {
    fontFamily: "Comfortaa",
    fontSize: 16,
    color: "#222B45",
  },
  inviteContent: {
    paddingTop: 10,
  },
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
