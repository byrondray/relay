import React from "react";
import { View, Text } from "react-native";
import { Select, SelectItem, IndexPath } from "@ui-kitten/components";
import { Group } from "@/graphql/generated";

const GroupPicker = ({
  groups,
  selectedGroupIndex,
  setSelectedGroupIndex,
  textColor,
}: {
  groups: Group[];
  selectedGroupIndex: IndexPath;
  setSelectedGroupIndex: (index: IndexPath) => void;
  textColor: string;
}) => {
  return (
    <View>
      <Text
        style={{
          color: "#FF6A00",
          fontSize: 22,
          marginBottom: 15,
          marginTop: 15,
          fontFamily: "Comfortaa",
        }}
      >
        Select Group
      </Text>
      <Text
        style={{ color: textColor, marginBottom: 5, fontFamily: "Comfortaa" }}
      >
        Groups
      </Text>

      <Select
        selectedIndex={selectedGroupIndex}
        onSelect={(index: IndexPath | IndexPath[]) => {
          if (index instanceof IndexPath) {
            setSelectedGroupIndex(index);
          }
        }}
        value={groups[selectedGroupIndex?.row]?.name || "Select Group"}
        placeholder="Select Group"
        style={{ borderColor: "transparent" }}
      >
        {groups.map((group, index) => (
          <SelectItem title={group.name} key={group.id} />
        ))}
      </Select>
    </View>
  );
};

export default GroupPicker;
