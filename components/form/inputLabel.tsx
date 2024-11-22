import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface LabelProps {
  label: string;
}

const ParentFormLabel: React.FC<LabelProps> = ({ label }) => {
  const { currentColors } = useTheme();

  return (
    <View style={styles.labelContainer}>
      <Text
        style={[
          styles.labelText,
          {
            color: currentColors.placeholder,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.requiredText,
          {
            color: currentColors.placeholder, 
          },
        ]}
      >
        Required
      </Text>
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
    fontWeight: "600",
    fontFamily: "Comfortaa",
  },
  requiredText: {
    fontSize: 14,
    fontFamily: "Comfortaa",
  },
});

export default ParentFormLabel;
