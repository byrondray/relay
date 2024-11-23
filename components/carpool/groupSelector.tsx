import React from "react";
import { View, Text } from "react-native";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { Group } from "@/graphql/generated";
import { useTheme } from "@/contexts/ThemeContext";
const GroupPicker = ({
  groups,
  selectedGroupIndex,
  setSelectedGroupIndex,
}: {
  groups: Group[];
  selectedGroupIndex: IndexPath;
  setSelectedGroupIndex: (index: IndexPath) => void;
}) => {
  const { currentColors } = useTheme();
  return (
    <View>
      <Text
        style={{
          color: currentColors.tint,
          fontSize: 16,
          marginBottom: 15,
          marginTop: 15,
          fontFamily: "Comfortaa",
        }}
      >
        Select a group to share the post:
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            color: currentColors.text,
            marginTop: 15,
            marginBottom: 5,
            fontFamily: "Comfortaa",
          }}
        >
          Groups
        </Text>
        <Text
          style={{
            color: currentColors.text,
            marginTop: 15,
            marginBottom: 5,
            fontFamily: "Comfortaa-Regular",
          }}
        >
          * Required
        </Text>
      </View>
      <View
        style={{
          backgroundColor: currentColors.placeholder,
          height: 43,
          borderColor: currentColors.placeholder,
          borderWidth: 1,
          borderRadius: 15,
          paddingLeft: 15,
          justifyContent: "center",
        }}
      >
        <Select
          selectedIndex={selectedGroupIndex}
          onSelect={(index: IndexPath | IndexPath[]) => {
            if (index instanceof IndexPath) {
              setSelectedGroupIndex(index);
            }
          }}
          value={groups[selectedGroupIndex?.row]?.name || "Select Group"}
          placeholder="Select Group"
        >
          {groups.map((group, index) => (
            <SelectItem title={group.name} key={group.id} />
          ))}
        </Select>
      </View>
    </View>
  );
};

export default GroupPicker;
