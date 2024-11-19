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
          fontSize: 22,
          marginBottom: 15,
          marginTop: 15,
          fontFamily: "Comfortaa",
        }}
      >
        Select Group
      </Text>
      <Text
        style={{ color: currentColors.text, marginBottom: 5, fontFamily: "Comfortaa" }}
      >
        Groups
      </Text>
      <View
        style={{
          backgroundColor: currentColors.placeholder,
          height: 43,
          borderColor: "#E4E9F2",
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
          style={{ borderColor: currentColors.placeholder }}
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
