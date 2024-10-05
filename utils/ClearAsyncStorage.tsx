import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage successfully cleared!');
  } catch (e) {
    console.error('Failed to clear AsyncStorage:', e);
  }
};
