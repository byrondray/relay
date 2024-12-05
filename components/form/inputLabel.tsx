import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface LabelProps {
  label: string;
  styleAdd?: object; 
}

const ParentFormLabel: React.FC<LabelProps> = ({ label, styleAdd = {} }) => {
  const { currentColors } = useTheme();

  return (
    /**
     * Renders a view component for a form label with additional styling.
     * 
     * @param {object} props - The properties passed to the component.
     * @param {object} props.styles - The base styles for the label container.
     * @param {string} props.styleAdd - Additional styles to be applied to the label container.
     * @returns {React.ReactElement} A View component with combined styles for the label container.
     */
    <View style={[styles.labelContainer, styleAdd, {}]}>

      <Text
        style={[
          styles.labelText,
          {
            color: currentColors.text,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.requiredText,
          {
            color: currentColors.tint, 
          },
        ]}
      >
        *Required
      </Text>
    </View>
  );
};



const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    letterSpacing: -0.3,
  },
  labelText: {
    fontSize: 15,
    fontFamily: "ComfortaaBold",
    letterSpacing: -0.3,
  },
  requiredText: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
    letterSpacing: -0.3,
  },
});

export default ParentFormLabel;
