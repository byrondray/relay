import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import { GET_CONVERSATIONS_FOR_USER } from '@/graphql/queries';
import { auth } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConversationsListScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [manualUserId, setManualUserId] = useState<string>('');
  const router = useRouter();
  const userId = auth.currentUser?.uid || '';

  const { data, loading, error, refetch } = useQuery(
    GET_CONVERSATIONS_FOR_USER,
    {
      variables: { userId },
      skip: !userId,
      onCompleted: async (data) => {
        setConversations(data.getConversationsForUser);
        await AsyncStorage.setItem(
          `conversations_${userId}`,
          JSON.stringify(data.getConversationsForUser)
        );
      },
      onError: async () => {
        const cachedConversations = await AsyncStorage.getItem(
          `conversations_${userId}`
        );
        if (cachedConversations) {
          setConversations(JSON.parse(cachedConversations));
          Alert.alert('Offline Mode', 'Loaded conversations from cache.');
        } else {
          Alert.alert('Error', 'Failed to load conversations.');
        }
      },
    }
  );

  const openConversation = (recipientId: string) => {
    router.push({
      pathname: '/messages/[userId]',
      params: { userId: recipientId },
    });
  };

  const handleManualUserIdSubmit = () => {
    if (manualUserId.trim()) {
      openConversation(manualUserId);
      setManualUserId('');
    } else {
      Alert.alert('Error', 'Please enter a valid user ID.');
    }
  };

  if (loading) return <Text>Loading conversations...</Text>;
  if (error) return <Text>Error loading conversations.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.recipientName}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => openConversation(item.recipientId)}
          >
            <Text style={styles.conversationTitle}>
              Conversation with {item.recipientName}
            </Text>
            <Text numberOfLines={1} style={styles.messagePreview}>
              {item.messages[0]?.text || 'No messages yet...'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        value={manualUserId}
        onChangeText={setManualUserId}
        placeholder='Enter User ID'
      />
      <Button title='Go to User' onPress={handleManualUserIdSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagePreview: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    marginVertical: 10,
  },
});
