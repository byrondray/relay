import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';

export function ThemedAddressCompletionInput({
  style,
  onSuggestionSelect,
  ...restProps
}: TextInputProps & { onSuggestionSelect: (address: string) => void }) {
  const [suggestions, setSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const fetchAddressSuggestions = async (input: string) => {
    if (!input) return;

    try {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        setSuggestions(data.predictions.slice(0, 3) || []);
      } else {
        console.error(
          'Autocomplete API error:',
          data.status,
          data.error_message
        );
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  return (
    <ThemedView style={style}>
      <TextInput
        style={[styles.input, { backgroundColor, color: textColor }, style]}
        onChange={(event) => {
          const text = event.nativeEvent.text;
          restProps.onChange?.(event);
          fetchAddressSuggestions(text);
        }}
        {...restProps}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSuggestionSelect(item.description);
                setSuggestions([]);
              }}
            >
              <Text style={styles.suggestionText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
