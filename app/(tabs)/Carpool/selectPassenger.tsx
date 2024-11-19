import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext'; // Import the theme context

const passengers = [
  { name: 'Catherine', image: require('@/assets/images/Catherine.png') },
  { name: 'Anthony', image: require('@/assets/images/Anthony.png') },
  { name: 'Anna', image: require('@/assets/images/Anna.png') },
  { name: 'Michael', image: require('@/assets/images/Michael.png') },
];

export default function SelectPassengerScreen() {
  const { currentColors } = useTheme(); // Access currentColors from the theme context

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.cancelText, { color: currentColors.text }]}>Cancel</Text>
        <Text style={[styles.saveText, { color: currentColors.text }]}>Save</Text>
      </View>
      <Text style={[styles.title, { color: currentColors.text }]}>Select Passenger</Text>
      <Text style={[styles.subtitle, { color: currentColors.text }]}>
        Select from recent chat
      </Text>

      <ScrollView
        contentContainerStyle={styles.imageContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {passengers.map((passenger, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={passenger.image} style={styles.image} />
            <Text style={[styles.name, { color: currentColors.text }]}>
              {passenger.name}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text style={[styles.searchText, { color: currentColors.text }]}>
        Search from friend list
      </Text>
      <TextInput
        style={[
          styles.searchBar,
          { backgroundColor: currentColors.placeholder, borderColor: currentColors.placeholder },
        ]}
        placeholder="Search from friend list"
        placeholderTextColor={currentColors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    fontSize: 16,
  },
  saveText: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
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
  },
  searchText: {
    fontSize: 16,
    marginBottom: 5,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    marginBottom: 400,
  },
});
