import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

type FriendCardProps = {
  id: string;
  name: string;
  source: string;
  imageUrl?: string;
  showCheckmark?: boolean;
};

const FriendCard: React.FC<FriendCardProps> = ({
  id,
  name,
  source,
  imageUrl,
  showCheckmark = true,
}) => {
  const [selected, setSelected] = useState(false);
  const { currentColors } = useTheme();

  const toggleSelection = () => {
    setSelected((prevSelected) => !prevSelected);
  };

  return (
    <View
      style={[styles.friendItem, { backgroundColor: currentColors.background }]}
    >
      <View style={styles.profileImage}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.initialText}>{name.charAt(0)}</Text>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: currentColors.text }]}>
          {name}
        </Text>
        <Text style={[styles.friendSource, { color: currentColors.text }]}>
          {source}
        </Text>
      </View>
      {showCheckmark && (
        <TouchableOpacity onPress={toggleSelection} style={styles.checkbox}>
          <View
            style={[
              styles.checkboxSquare,
              selected && styles.checkboxSquareSelected,
              { borderColor: currentColors.text },
            ]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  initialText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
  },
  friendSource: {
    fontSize: 14,
  },
  checkbox: {
    paddingHorizontal: 8,
  },
  checkboxSquare: {
    width: 24,
    height: 24,
    borderRadius: 6, // Rounded square
    borderWidth: 2,
    backgroundColor: "white",
  },
  checkboxSquareSelected: {
    backgroundColor: "#FF6C00",
  },
});

export default FriendCard;
