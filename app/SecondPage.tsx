import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Transition from '../components/Transition'; // Ensure your Transition component is compatible with React Native
import { useRouter } from 'expo-router';

const SecondPage = () => {
  const router = useRouter();

  return (
    <Transition>
      <View style={styles.container}>
        <Text style={styles.title}>Second Page</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/FirstPage')}
        >
          <Text style={styles.buttonText}>Back to First Page</Text>
        </TouchableOpacity>
      </View>
    </Transition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default SecondPage;
