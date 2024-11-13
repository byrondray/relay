import React, { useState } from "react";
import { Layout, Text, Button, Input, Icon } from "@ui-kitten/components";
import { View } from "react-native";
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
      <View>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Friend's email"
          style={{
            marginTop: 10,
            borderWidth: 1,
            padding: 10,
            borderRadius: 24,
          }}
          accessoryLeft={() => <EmailIcon style={{ width: 20, height: 20 }} />}
        />
      </View>
    );
  };

  return (
    <Layout>
      <Button
        appearance="ghost"
        status="basic"
        accessoryRight={() => <Text>{expanded ? "-" : "+"}</Text>}
        onPress={toggleExpand}
        style={{ justifyContent: "space-between" }}
      >
        Invite a Friend by Email
      </Button>
      {expanded && renderInviteContent()}
    </Layout>
  );
};

export default InviteFriendDropdown;
