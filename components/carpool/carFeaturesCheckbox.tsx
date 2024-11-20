import React from "react";
import { View, Text } from "react-native";
import { CheckBox } from "@ui-kitten/components";
import { useTheme } from "@/contexts/ThemeContext";
import { useTextSize } from "@/contexts/TextSizeContext";

const CarFeaturesCheckbox = ({
  extraCarseatChecked,
  winterTiresChecked,
  setExtraCarseatChecked,
  setWinterTiresChecked,
}: {
  extraCarseatChecked: boolean;
  winterTiresChecked: boolean;
  setExtraCarseatChecked: (nextChecked: boolean) => void;
  setWinterTiresChecked: (nextChecked: boolean) => void;
}) => {
  const { currentColors } = useTheme();
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        paddingLeft: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 20,
        }}
      >
        <CheckBox
          checked={extraCarseatChecked}
          onChange={(nextChecked) => setExtraCarseatChecked(nextChecked)}
        />
        <Text style={{ marginLeft: 8, fontFamily: "Comfortaa", color: currentColors.text, fontSize: 10 * textScaleFactor }}>With Extra Carseat</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CheckBox
          checked={winterTiresChecked}
          onChange={(nextChecked) => setWinterTiresChecked(nextChecked)}
        />
        <Text style={{ marginLeft: 8, fontFamily: "Comfortaa", color: currentColors.text, fontSize: 10 * textScaleFactor}}>
          With Winter Tires
        </Text>
      </View>
    </View>
  );
};

export default CarFeaturesCheckbox;
