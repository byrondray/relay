import React from "react";
import { View, Text } from "react-native";
import { CheckBox } from "@ui-kitten/components";

const PricingCheckbox = ({
  voluntaryChecked,
  shareCostChecked,
  setVoluntaryChecked,
  setShareCostChecked,
}: {
  voluntaryChecked: boolean;
  shareCostChecked: boolean;
  setVoluntaryChecked: (nextChecked: boolean) => void;
  setShareCostChecked: (nextChecked: boolean) => void;
}) => {
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
          checked={voluntaryChecked}
          onChange={(nextChecked) => setVoluntaryChecked(nextChecked)}
        />
        <Text style={{ marginLeft: 8, fontFamily: "Comfortaa-Regular" }}>Voluntary</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CheckBox
          checked={shareCostChecked}
          onChange={(nextChecked) => setShareCostChecked(nextChecked)}
        />
        <Text style={{ marginLeft: 8, fontFamily: "Comfortaa-Regular" }}>
          Share Cost
        </Text>
      </View>
    </View>
  );
};

export default PricingCheckbox;
