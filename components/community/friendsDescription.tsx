import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme

const FriendsInviteDescription = ({
  description,
  setDescription,
}: {
  description: string;
  setDescription: (text: string) => void;
}) => {
  const { currentColors } = useTheme(); // Access current theme colors

  return (
    <View>
      <Text
        style={[
          styles.descriptionText,
          { color: currentColors.text }, // Apply text color from theme
        ]}
      >
        You can write a message to invite your friends
      </Text>
      <TextInput
        style={[
          styles.inputField,
          { backgroundColor: currentColors.background, borderColor: currentColors.tint }, // Apply background and border from theme
        ]}
        placeholder="Hi, I’d like to invite you to join my trusted group."
        placeholderTextColor={currentColors.placeholder} // Apply placeholder color from theme
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "Comfortaa",
    fontSize: 12,
  },
  inputField: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: "Comfortaa",
  },
});

export default FriendsInviteDescription;
