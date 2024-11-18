import React from "react";
import { View, Text, TextInput } from "react-native";

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
        Description
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
        placeholder={placeholder}
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

export default TripDescriptionInput;
