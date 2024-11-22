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
          style={{ color: textColor, marginTop: 15,  marginBottom: 5, fontFamily: "Comfortaa" }}
        >
          Groups
        </Text>
        <Text
          style={{
            color: textColor,
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
          backgroundColor: "#F7F9FC",
          height: 43,
          borderColor: "#E4E9F2",
          borderWidth: 1,
          borderRadius: 15,
          paddingLeft: 15,
          justifyContent: "center",
        }}>
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
