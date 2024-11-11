import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  const toggleSelection = () => {
    setSelected((prevSelected) => !prevSelected);
  };

  return (
    <View style={styles.friendItem}>
      <View style={styles.profileImage}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.initialText}>{name.charAt(0)}</Text>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{name}</Text>
        <Text style={styles.friendSource}>{source}</Text>
      </View>
      {showCheckmark && (
        <TouchableOpacity onPress={toggleSelection} style={styles.checkbox}>
          <View style={[styles.checkboxSquare, selected && styles.checkboxSquareSelected]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  initialText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
  },
  friendSource: {
    color: 'gray',
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
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  checkboxSquareSelected: {
    backgroundColor: '#FF6C00',
    borderColor: '#FF6C00',
  },
});

export default FriendCard;
