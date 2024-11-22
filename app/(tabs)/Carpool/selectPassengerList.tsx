import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext'; // Import the theme context

type Friend = {
  name: string;
  class: string;
  initial: string;
};

const passengers = [
  { name: 'Catherine', image: require('@/assets/images/Catherine.png') },
  { name: 'Anthony', image: require('@/assets/images/Anthony.png') },
  { name: 'Anna', image: require('@/assets/images/Anna.png') },
  { name: 'Michael', image: require('@/assets/images/Michael.png') },
];

const friendsList: Friend[] = [
  { name: 'Arabella', class: 'From dancing class', initial: 'A' },
  { name: 'Annie', class: 'From music class', initial: 'A' },
  { name: 'Andy', class: 'From hockey class', initial: 'A' },
  { name: 'Ben', class: 'From dancing class', initial: 'B' },
  { name: 'Bennett', class: 'From music class', initial: 'B' },
  { name: 'Brandon', class: 'From chess club', initial: 'B' },
  { name: 'Carla', class: 'From art class', initial: 'C' },
  { name: 'Carter', class: 'From soccer team', initial: 'C' },
  { name: 'Daisy', class: 'From dance class', initial: 'D' },
  { name: 'Daniel', class: 'From basketball team', initial: 'D' },
  { name: 'Eva', class: 'From math club', initial: 'E' },
  { name: 'Evan', class: 'From science club', initial: 'E' },
  { name: 'Fiona', class: 'From gymnastics', initial: 'F' },
  { name: 'Frank', class: 'From football team', initial: 'F' },
  { name: 'Grace', class: 'From theater', initial: 'G' },
];

const spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
};

const groupFriendsByInitial = (friends: Friend[]) => {
  return friends.reduce((acc: { [key: string]: Friend[] }, friend) => {
    const initial = friend.initial;
    if (!acc[initial]) {
      acc[initial] = [];
    }
    acc[initial].push(friend);
    return acc;
  }, {});
};

export default function SelectPassengerScreen() {
  const { currentColors } = useTheme();  // Access currentColors from the theme context
  const [searchTerm, setSearchTerm] = useState<string>('');
  const groupedFriends = groupFriendsByInitial(friendsList);

  // Filter the friends list based on the search term
  const filteredFriends = Object.keys(groupedFriends).reduce((acc, initial) => {
    const filteredFriendsByInitial = groupedFriends[initial].filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredFriendsByInitial.length > 0) {
      acc[initial] = filteredFriendsByInitial;
    }
    return acc;
  }, {} as { [key: string]: Friend[] });

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.cancelText, { color: currentColors.text }]}>Cancel</Text>
        <Text style={[styles.saveText, { color: currentColors.tint }]}>Save</Text>
      </View>
      
      <Text style={[styles.title, { color: currentColors.text }]}>Select Passenger</Text>
      <Text style={[styles.subtitle, { color: currentColors.text }]}>Select from recent chat</Text>

      {/* Recent Passengers Section */}
      <View style={styles.recentPassengersContainer}>
        <ScrollView
          contentContainerStyle={styles.imageContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {passengers.map((passenger, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={passenger.image} style={styles.image} />
              <Text style={[styles.name, { color: currentColors.text }]}>{passenger.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Friends Container (Search Bar + Friends List) */}
      <View style={styles.friendsContainer}>
        <Text style={[styles.searchText, { color: currentColors.tint }]}>Search from friend list</Text>
        <TextInput
          style={[styles.searchBar, { backgroundColor: currentColors.text }]}
          placeholder="Search from friend list"
          placeholderTextColor={currentColors.text}
          value={searchTerm}
          onChangeText={setSearchTerm} // Update search term on text input change
        />

        <ScrollView contentContainerStyle={styles.friendsList}>
          {Object.keys(filteredFriends).map((initial) => (
            <View key={initial} style={styles.initialSection}>
              <Text style={[styles.initialHeader, { color: currentColors.text }]}>{initial}</Text>
              {filteredFriends[initial].map((friend, index) => (
                <View key={index} style={styles.friendWrapper}>
                  <View style={styles.friendInfo}>
                    <Text style={[styles.friendInitial, { backgroundColor: currentColors.text }]}>{friend.initial}</Text>
                    <View>
                      <Text style={[styles.friendName, { color: currentColors.text }]}>{friend.name}</Text>
                      <Text style={[styles.friendClass, { color: currentColors.text }]}>{friend.class}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    fontFamily: "Comfortaa"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "Comfortaa"
  },
  saveText: {
    fontSize: 16,
    fontFamily: "Comfortaa"
  },
  title: {
    fontSize: 24,
    // fontWeight: 'bold',
    marginTop: spacing.small,
    fontFamily: "Comfortaa-bold"
  },
  subtitle: {
    fontSize: 16,
    marginVertical: spacing.small,
    fontFamily: "Comfortaa"
  },
  recentPassengersContainer: {
    marginBottom: spacing.large,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  imageWrapper: {
    alignItems: 'center',
    marginHorizontal: spacing.small,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    marginBottom: 5,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: "Comfortaa"
  },
  friendsContainer: {
    flex: 1,
    paddingTop: spacing.medium,
  },
  searchText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Comfortaa"
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: spacing.medium,
    marginBottom: spacing.medium,
    marginHorizontal: spacing.small,
    fontFamily: "Comfortaa"
  },
  friendsList: {
    paddingVertical: spacing.small,
  },
  initialSection: {
    paddingVertical: spacing.small,
  },
  initialHeader: {
    fontSize: 18,
    paddingHorizontal: spacing.medium,
  },
  friendWrapper: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: spacing.small,
  },
  friendName: {
    fontSize: 16,
  },
  friendClass: {
    fontSize: 14,
  },
});
