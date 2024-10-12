import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  GET_PRIVATE_MESSAGE_CONVERSATION,
  CREATE_MESSAGE,
} from '@/graphql/queries';
import { MESSAGE_SENT_SUBSCRIPTION } from '@/graphql/queries';
import { auth } from '@/firebaseConfig';

export default function MessageScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<null | any>(null);
  const { userId } = useLocalSearchParams();

  const router = useRouter();
  const senderId = auth.currentUser?.uid || '';

  const { data, loading, error, refetch } = useQuery(
    GET_PRIVATE_MESSAGE_CONVERSATION,
    {
      variables: { senderId, recipientId: userId },
      skip: !senderId || !userId,
      onCompleted: async (data) => {
        const fetchedMessages = data.getPrivateMessageConversation;
        setMessages(fetchedMessages);
        await AsyncStorage.setItem(
          `messages_${userId}`,
          JSON.stringify(fetchedMessages)
        );
      },
      onError: async () => {
        const cachedMessages = await AsyncStorage.getItem(`messages_${userId}`);
        if (cachedMessages) {
          setMessages(JSON.parse(cachedMessages));
          Alert.alert('Offline Mode', 'Loaded messages from cache.');
        } else {
          Alert.alert('Error', 'Failed to load messages.');
        }
      },
    }
  );

  const [createMessage] = useMutation(CREATE_MESSAGE);

  // Use the subscription to listen for new messages
  const { data: subscriptionData } = useSubscription(
    MESSAGE_SENT_SUBSCRIPTION,
    {
      variables: { recipientId: userId },
      onSubscriptionData: ({ subscriptionData }) => {
        const newMessage = subscriptionData.data.messageSent;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Store the updated messages in AsyncStorage
        AsyncStorage.setItem(
          `messages_${userId}`,
          JSON.stringify([...messages, newMessage])
        );
      },
    }
  );

  useEffect(() => {
    const loadUser = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        router.replace('/Login/login');
      } else {
        setUser(firebaseUser);
      }
    };

    loadUser();
  }, [userId]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    // Listen for foreground notifications
    const handleForegroundNotification =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        const { senderId: messageSenderId, text } = data;

        if (messageSenderId === userId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text,
              senderId: messageSenderId,
              id: new Date().getTime().toString(),
            },
          ]);

          // Store in AsyncStorage
          AsyncStorage.setItem(
            `messages_${userId}`,
            JSON.stringify([...messages, { text, senderId: messageSenderId }])
          );
        } else {
          Alert.alert('New Message', `Message from another user: ${text}`);
        }
      });

    requestNotificationPermission();

    return () => {
      Notifications.removeNotificationSubscription(
        handleForegroundNotification
      );
    };
  }, [userId, messages]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        senderId,
        recipientId: userId,
        text: newMessage,
      };

      try {
        const result = await createMessage({ variables: messageData });
        setMessages([...messages, result.data.createMessage]);
        await AsyncStorage.setItem(
          `messages_${userId}`,
          JSON.stringify([...messages, result.data.createMessage])
        );
        setNewMessage('');
      } catch (error) {
        Alert.alert('Error', 'Failed to send message.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.text}</Text>
        )}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder='Type a message...'
      />
      <Button title='Send' onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    marginBottom: 10,
  },
});
