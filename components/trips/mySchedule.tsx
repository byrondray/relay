import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { Input } from "@ui-kitten/components";
import SearchIcon from "@/assets/images/search.svg";
import { useTheme } from "@/contexts/ThemeContext";

const MySchedule = () => {
  const [searchText, setSearchText] = useState("");
  const { currentColors } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 16,
        marginTop: -5,
      }}
    >
      <Input
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
        accessoryRight={() => <SearchIcon width={24} height={24} />}
        style={{
          flex: 1,
          backgroundColor: currentColors.placeholder,
          borderRadius: 24,
          fontFamily: "Comfortaa",
        }}
      />
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 20,
          color: currentColors.text,
          marginTop: 60,
        }}
      >
        My Schedule
      </Text>
      <Text>SOMETHING</Text>
    </View>
  );
};

export default MySchedule;
