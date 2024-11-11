import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';

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
  const groupedFriends = groupFriendsByInitial(friendsList);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cancelText}>Cancel</Text>
        <Text style={styles.saveText}>Save</Text>
      </View>
      
      <Text style={styles.title}>Select Passenger</Text>
      <Text style={styles.subtitle}>Select from recent chat</Text>

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
              <Text style={styles.name}>{passenger.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Friends Container (Search Bar + Friends List) */}
      <View style={styles.friendsContainer}>
      <Text style={styles.searchText}>Search from friend list</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search from friend list"
          placeholderTextColor="#B0B0B0"
        />

        <ScrollView contentContainerStyle={styles.friendsList}>
          {Object.keys(groupedFriends).map((initial) => (
            <View key={initial} style={styles.initialSection}>
              <Text style={styles.initialHeader}>{initial}</Text>
              {groupedFriends[initial].map((friend, index) => (
                <View key={index} style={styles.friendWrapper}>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendInitial}>{friend.initial}</Text>
                    <View>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <Text style={styles.friendClass}>{friend.class}</Text>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    color: '#FF6C00',
    fontSize: 16,
  },
  saveText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.small,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginVertical: spacing.small,
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
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  friendsContainer: {
    flex: 1,
    paddingTop: spacing.medium,
  },
  searchText: {
    fontSize: 16,
    color: '#888', // Changed to grey for subtle appearance
    marginBottom: 5,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingLeft: spacing.medium,
    backgroundColor: '#F7F7F7',
    marginBottom: spacing.medium,
    marginHorizontal: spacing.small,
  },
  friendsList: {
    paddingVertical: spacing.small,
  },
  initialSection: {
    paddingVertical: spacing.small,
  },
  initialHeader: {
    fontSize: 18,
    color: '#888',
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
    backgroundColor: '#FF6C00',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: spacing.small,
  },
  friendName: {
    fontSize: 16,
    color: '#333',
  },
  friendClass: {
    fontSize: 14,
    color: '#888',
  },
});
