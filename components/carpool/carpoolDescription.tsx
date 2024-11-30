import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const TripDescriptionInput = ({
  description,
  setDescription,
  placeholder,
}: {
  description: string;
  placeholder: string;
  setDescription: (text: string) => void;
}) => {
  const { currentColors } = useTheme();

  return (
    <View>
      {/* Description Label */}
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

      {/* Input Field */}
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
          color: currentColors.text,
          fontFamily: "Comfortaa",
          paddingTop: 10,
        }}
        placeholderTextColor={"#8F9BB3"}
        placeholder="Any preferences for trips? (e.g., preferred age range of kids, allowed stopovers, special requests)"
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

export default TripDescriptionInput;
