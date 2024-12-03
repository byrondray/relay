import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

// Define the props type for the component
type CameraButtonProps = {
  title: string; // Title displayed next to the icon
  onPress: () => void; // Function to handle button press
  icon: string; // Icon name (from Entypo icons)
  color?: string; // Optional color for icon and text
};

export default function CameraButton({
  title,
  onPress,
  icon,
  color = "#f1f1f1",
}: CameraButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo name={icon} size={28} color={color} />
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
