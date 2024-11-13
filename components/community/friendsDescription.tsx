import React from "react";
import { View, Text, TextInput } from "react-native";

const FriendsInviteDescription = ({
  textColor,
  description,
  setDescription,
}: {
  textColor: string;
  description: string;
  setDescription: (text: string) => void;
}) => {
  return (
    <View>
      <Text
        style={{
          color: textColor,
          marginBottom: 5,
          marginTop: 10,
          fontFamily: "Comfortaa",
        }}
      >
        You can write a message to invite your friends
      </Text>
      <TextInput
        style={{
          width: "100%",
          backgroundColor: "#F7F9FC",
          borderColor: "#E4E9F2",
          borderWidth: 1,
          borderRadius: 15,
          height: 100,
          paddingLeft: 30,
          paddingRight: 30,
          fontFamily: "Comfortaa",
        }}
        placeholder="Hi, I’d like to invite you to join my trusted group.)"
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

export default FriendsInviteDescription;
