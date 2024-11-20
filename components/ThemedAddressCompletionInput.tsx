import React, { useState, useCallback } from "react";
import {
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import debounce from "lodash.debounce";
import { useTheme } from "@/contexts/ThemeContext";
import { useTextSize } from "@/contexts/TextSizeContext";

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
  const { currentColors } = useTheme();
  const { isLargeText, textScaleFactor } = useTextSize();
  return (
    <View style={style}>
      <TextInput
        style={[
          styles.input,
          { color: currentColors.text, paddingLeft: 15, fontFamily: "Comfortaa", backgroundColor: currentColors.placeholder, borderColor: currentColors.placeholder },
          style,
        ]}
        placeholderTextColor={currentColors.text}
        value={value}
        onChangeText={(text) => {
          if (!isSuggestionSelected) {
            onChangeText(text);
            fetchAddressSuggestions(text);
          } else {
            setIsSuggestionSelected(false);
          }
        }}
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
    backgroundColor: "#F7F9FC",
    borderColor: "#E4E9F2",
    borderWidth: 1,
    height: 43,
  },
  suggestionText: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: "#F7F9FC",
    borderColor: "#E4E9F2",
    fontFamily: "Comfortaa",
  },
});
