import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';

const passengers = [
  { name: 'Catherine', image: require('@/assets/images/Catherine.png') },
  { name: 'Anthony', image: require('@/assets/images/Anthony.png') },
  { name: 'Anna', image: require('@/assets/images/Anna.png') },
  { name: 'Michael', image: require('@/assets/images/Michael.png') },
];

export default function SelectPassengerScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cancelText}>Cancel</Text>
        <Text style={styles.saveText}>Save</Text>
      </View>
      <Text style={styles.title}>Select Passenger</Text>
      <Text style={styles.subtitle}>Select from recent chat</Text>

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

      <Text style={styles.searchText}>Search from friend list</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search from friend list"
        placeholderTextColor="#B0B0B0"
      />
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
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888', // Changed to grey for subtle appearance
    marginVertical: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 45,
    marginBottom: 5,
    marginTop: 5,
  },
  name: {
    fontSize: 14,
    color: '#888', // Changed to grey for subtle appearance
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
    paddingLeft: 15,
    backgroundColor: '#F7F7F7',
    marginBottom: 400,
  },
});
