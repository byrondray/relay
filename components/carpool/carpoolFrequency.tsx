import React from "react";
import { View, Text } from "react-native";
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
    <View style={{ marginBottom: 20 }}>
      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={(index: number) => setSelectedIndex(index)}
        style={{ width: "100%" }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Radio style={{ marginRight: 10 }} />
          <Text
            style={{
              color: currentColors.text,
              marginRight: 20,
              fontFamily: "Comfortaa",
            }}
          >
            One time
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Radio />
          <Text
            style={{
              color: currentColors.text,
              marginLeft: 10,
              fontFamily: "Comfortaa",
            }}
          >
            Recurring
          </Text>
        </View>
      </RadioGroup>
    </View>
  );
};

export default RadioGroupComponent;
