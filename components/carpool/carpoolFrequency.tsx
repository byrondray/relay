import React from "react";
import { View } from "react-native";
import { Radio, RadioGroup } from "@ui-kitten/components";

interface RadioGroupComponentProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
  selectedIndex,
  setSelectedIndex,
}) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={(index: number) => setSelectedIndex(index)}
        style={{ flexDirection: "row", width: "100%" }}
      >
        <Radio style={{ marginRight: 10 }}>One time</Radio>
        <Radio>Recurring</Radio>
      </RadioGroup>
    </View>
  );
};

export default RadioGroupComponent;
