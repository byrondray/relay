import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ParentFormInputProps {
  placeholder: string;
  value?: string | null; 
  onChangeText: (text: string) => void;
}

function ParentFormInput({
  placeholder,
  value,
  onChangeText,
}: ParentFormInputProps): JSX.Element {
  const { currentColors } = useTheme();
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: currentColors.tint,
            backgroundColor: currentColors.background,
            color: currentColors.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={currentColors.icon}
        value={value ?? ""} 
        onChangeText={onChangeText} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 42,
    borderRadius: 25,
    borderWidth: 1,
    // borderColor: "#E4E9F2",
    // backgroundColor: "#F7F9FC",
    paddingLeft: 20,
    fontSize: 16,
    // color: "#A0A3BD",
    fontFamily: "Comfortaa",
  },
});

export default ParentFormInput;
