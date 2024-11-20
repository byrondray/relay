import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useTextSize } from "@/contexts/TextSizeContext";

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
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <View>
      <Text
        style={{
          color: currentColors.text,
          marginBottom: 5,
          marginTop: 10,
          fontFamily: "Comfortaa",
          fontSize: 15 * textScaleFactor
        }}
      >
        Description
      </Text>
      <TextInput
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: currentColors.placeholder,
          borderColor: currentColors.tint,
          borderWidth: 1,
          borderRadius: 15,
          height: 100,
          paddingLeft: 30,
          paddingRight: 30,
          fontFamily: "Comfortaa",
          fontSize: 10 * textScaleFactor,
          paddingBottom: 10
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
