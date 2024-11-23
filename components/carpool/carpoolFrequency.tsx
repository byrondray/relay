import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Radio, RadioGroup } from "@ui-kitten/components";
import { useTheme } from "@/contexts/ThemeContext";

interface RadioGroupComponentProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
  selectedIndex,
  setSelectedIndex,
}) => {
  const { currentColors } = useTheme();

  return (
    <View style={{ marginBottom: 20, width: "100%", flexDirection: "row" }}>
      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={(index: number) => setSelectedIndex(index)}
        style={{ width: "100%" }}
      >
        <Radio style={{ marginRight: 10 }}>
          {() => <Text style={styles.radioText}>One time</Text>}
        </Radio>
        <Radio>{() => <Text style={styles.radioText}>Recurring</Text>}</Radio>
      </RadioGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  radioText: {
    fontFamily: "Comfortaa-Regular",
    marginLeft: 10,
    fontSize: 14,
  },
});

export default RadioGroupComponent;
