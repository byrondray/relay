import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface LabelProps {
  label: string;
}

const ParentFormLabel: React.FC<LabelProps> = ({ label }) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.requiredText}>Required</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  labelText: {
    fontSize: 16,
    color: "#8F9BB3",
    fontWeight: "600",
    fontFamily: "Comfortaa",
  },
  requiredText: {
    fontSize: 14,
    color: "#8F9BB3",
    fontFamily: "Comfortaa",
  },
});

export default ParentFormLabel;
