import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Friend = {
  id: string;
  name: string;
  source: string;
  selected: boolean;
};

const friendsData: Friend[] = [
  { id: '1', name: 'Emily Thompson', source: 'From dancing class', selected: false },
  { id: '2', name: 'Grace Lam', source: 'From dancing class', selected: false },
  { id: '3', name: 'Laura Nguyen', source: 'From dancing class', selected: false },
  { id: '4', name: 'Mark Jacob', source: 'From dancing class', selected: false },
];

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>(friendsData);
  const [searchText, setSearchText] = useState<string>('');

  const toggleSelection = (id: string) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === id ? { ...friend, selected: !friend.selected } : friend
      )
    );
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.profileImage}>
        <Text style={styles.initialText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendSource}>{item.source}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.checkbox}>
        <View style={[styles.checkboxSquare, item.selected && styles.checkboxSquareSelected]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friend by name or email address"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 20,
  },
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
    borderRadius: 6,  // Rounded corners for the checkbox
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  checkboxSquareSelected: {
    backgroundColor: '#FF6C00',
    borderColor: '#FF6C00',
  },
});

export default FriendsList;
