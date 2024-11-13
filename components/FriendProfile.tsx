import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type FriendProfileProps = {
  id: string;
  name: string;
  imageUrl: string;
  onSelect?: (id: string) => void;
};

const FriendProfile: React.FC<FriendProfileProps> = ({ id, name, imageUrl, onSelect }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleSelect = () => {
    setShowCheckmark(!showCheckmark);
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <TouchableOpacity style={styles.profileContainer} onPress={handleSelect} activeOpacity={0.7}>
      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        {showCheckmark && (
          <View style={styles.checkmarkContainer}>
            <MaterialIcons name="check-circle" size={26} color="#FF6C00" />
            <MaterialIcons name="check" size={16} color="#FFFFFF" style={styles.checkmarkIcon} />
          </View>
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profilesRow: {
    flexDirection: 'row', // Align profiles horizontally
    justifyContent: 'flex-start', // Align to the start of the row
    flexWrap: 'nowrap', // Prevent wrapping
    margin: 10, // Add margins around the entire row of profiles
    marginTop: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  imageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -2,
    right: -4,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    position: 'absolute',
  },
  name: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default FriendProfile;
