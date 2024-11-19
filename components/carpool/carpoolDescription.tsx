import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const TripDescriptionInput = ({
  textColor,
  description,
  setDescription,
  placeholder,
}: {
  textColor: string;
  description: string;
  placeholder: string;
  setDescription: (text: string) => void;
}) => {
  const { currentColors } = useTheme();
  return (
    <View>
      <Text
        style={{
          color: currentColors.text,
          marginBottom: 5,
          marginTop: 10,
          fontFamily: "Comfortaa",
        }}
      >
        Description
      </Text>
      <TextInput
        style={{
          width: "100%",
          backgroundColor: currentColors.placeholder,
          borderColor: currentColors.tint,
          borderWidth: 1,
          borderRadius: 15,
          height: 100,
          paddingLeft: 30,
          paddingRight: 30,
          fontFamily: "Comfortaa",
        }}
        placeholder={placeholder}
        placeholderTextColor={currentColors.text}
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

export default TripDescriptionInput;
