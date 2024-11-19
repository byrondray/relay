import React, { useState, useCallback } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { TextInputProps } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
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
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

  // Get the current colors from the theme
  const { currentColors } = useTheme();

  // Function to fetch address suggestions with debounce
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

  // Function to fetch lat/lon from placeId
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
    <View style={style}>
      <TextInput
        style={[
          styles.input,
          { color: currentColors.text, backgroundColor: currentColors.placeholder, fontFamily: "Comfortaa", },
          style,
        ]}
        value={value}
        onChangeText={(text) => {
          if (!isSuggestionSelected) {
            onChangeText(text);
            fetchAddressSuggestions(text);
          } else {
            setIsSuggestionSelected(false);
          }
        }}
        placeholder="Enter address"
        placeholderTextColor="#FFFFFF" // Set placeholder text color to white
        {...restProps}
      />
      {suggestions.length > 0 && (
        <View>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => {
                setIsSuggestionSelected(true);
                onSuggestionSelect(item.description);
                fetchLatLonFromPlaceId(item.place_id);
                setSuggestions([]);
              }}
            >
              <Text style={styles.suggestionText}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    height: 43,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: "#F7F9FC",
    borderColor: "#E4E9F2",
  },
});
