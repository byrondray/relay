import React, { useState, useEffect, useCallback, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebaseConfig";
import {
  useFetchMessages,
  useSendMessage,
  useMessageSubscription,
  useFetchUser,
} from "../../../hooks/messages/useMessages";
import { DetailedMessage } from "@/graphql/generated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

export default function MessageScreen() {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Selected image URI
  const { userId } = useLocalSearchParams();
  const recipientIdString = Array.isArray(userId) ? userId[0] : userId;
  const currentUser = auth.currentUser;

  const flatListRef = useRef<FlatList>(null);

  // Function to open the media library and select an image
  const openMediaLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri); // Store selected image URI
