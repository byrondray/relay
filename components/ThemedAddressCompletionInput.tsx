import React, { useState, useCallback } from "react";
import {
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import debounce from "lodash.debounce";

export function ThemedAddressCompletionInput({
  style,
  onSuggestionSelect,
  onLatLonSelect,
  value, 
  onChangeText,
  ...restProps
}: TextInputProps & {
  onSuggestionSelect: (address: string) => void;
  onLatLonSelect: (lat: number, lon: number) => void;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const fetchAddressSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input) return;

      try {
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
          setSuggestions(data.predictions.slice(0, 3) || []);
        } else {
          console.error(
            "Autocomplete API error:",
            data.status,
            data.error_message
          );
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }, 300),
    []
  );

  const fetchLatLonFromPlaceId = async (placeId: string) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API;
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.result.geometry.location;
        onLatLonSelect(location.lat, location.lng);
      } else {
        console.error(
          "Place Details API error:",
          data.status,
          data.error_message
        );
      }
    } catch (error) {
      console.error("Error fetching lat/lon:", error);
    }
  };

  return (
    <ThemedView style={style}>
      <TextInput
        style={[styles.input, { backgroundColor, color: textColor }, style]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
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
                fetchLatLonFromPlaceId(item.place_id);
                onChangeText(item.description);
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
    borderColor: "#ccc",
    borderWidth: 1,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
