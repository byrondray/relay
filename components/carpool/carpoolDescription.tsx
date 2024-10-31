import React from "react";
import { View, Text, TextInput } from "react-native";

const TripDescriptionInput = ({
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
      <Text style={{ color: textColor, marginBottom: 5, marginTop: 10 }}>
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
        }}
        placeholder="Any preferences for trips? (e.g., preferred age range of kids, allowed stopovers, special requests)"
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
    </View>
  );
};

export default TripDescriptionInput;
