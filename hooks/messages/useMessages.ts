import { useQuery, useMutation, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GET_PRIVATE_MESSAGE_CONVERSATION,
  CREATE_MESSAGE,
} from '@/graphql/queries';
import { MESSAGE_SENT_SUBSCRIPTION } from '@/graphql/queries';
import { GET_USER } from '@/graphql/queries';
import { Alert } from 'react-native';
import { Message } from '@/graphql/generated';
import { useEffect } from 'react';

export const useFetchMessages = (
  senderId: string,
  recipientId: string,
  setMessages: (messages: Message[]) => void
) => {
  const { data, loading, error, refetch } = useQuery(
    GET_PRIVATE_MESSAGE_CONVERSATION,
    {
      variables: { senderId, recipientId },
      skip: !senderId || !recipientId,
      fetchPolicy: 'network-only',
      onCompleted: async (data) => {
        const fetchedMessages = data.getPrivateMessageConversation;

        const prevMessages: Message[] = [];
        const combinedMessages = [...prevMessages, ...fetchedMessages];
        const uniqueMessages = Array.from(
          new Map(combinedMessages.map((msg) => [msg.id, msg])).values()
        );
        setMessages(uniqueMessages);

        await AsyncStorage.setItem(
          `messages_${recipientId}`,
          JSON.stringify(fetchedMessages)
        );
      },
      onError: async (error) => {
        console.error('Failed to fetch messages:', error);

        const cachedMessages = await AsyncStorage.getItem(
          `messages_${recipientId}`
        );
        if (cachedMessages) {
          const cachedMessagesParsed: Message[] = JSON.parse(cachedMessages);
          const prevMessages: Message[] = []; // Define prevMessages here
          const combinedMessages: Message[] = [
            ...prevMessages,
            ...cachedMessagesParsed,
          ];
          const uniqueMessages: Message[] = Array.from(
            new Map(
              combinedMessages.map((msg: Message) => [msg.id, msg])
            ).values()
          );
          setMessages(uniqueMessages);
          Alert.alert('Offline Mode', 'Loaded messages from cache.');
        } else {
          Alert.alert(
            'Error',
            'Failed to load messages. Please check your network.'
          );
        }
      },
    }
  );

  return { data, loading, error, refetch };
};

export const useFetchUser = (userId: string) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Failed to fetch user:', error);
      Alert.alert('Error', 'Failed to load user information.');
    },
  });

  return { data, loading, error };
};

export const useSendMessage = (
  senderId: string,
  recipientId: string,
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void,
  messages: Message[],
  newMessage: string,
  setNewMessage: (message: string) => void,
  setIsMessageSent: (status: boolean) => void
) => {
  const [createMessage] = useMutation(CREATE_MESSAGE);

  const sendMessage = async () => {
    if (newMessage) {
      const messageData = {
        senderId,
        recipientId,
        text: newMessage,
      };

      try {
        await createMessage({ variables: messageData });
        setNewMessage('');
        setIsMessageSent(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: new Date().getTime().toString(),
            senderId,
            recipientId,
            text: newMessage,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Send message error:', error);
        Alert.alert(
          'Error',
          (error as Error).message || 'Failed to send message.'
        );
      }
    }
  };

  return { sendMessage };
};

export const useMessageSubscription = (
  recipientId: string,
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void,
  messages: Message[],
  isMessageSent: boolean
) => {
  const { data, error } = useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    variables: { recipientId },
    skip: !recipientId,
  });

  useEffect(() => {
    if (data?.messageSent) {
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        data.messageSent,
      ]);
      AsyncStorage.setItem(
        `messages_${recipientId}`,
        JSON.stringify([...messages, data.messageSent])
      );
    }
  }, [data]);

  if (error) {
    console.error('Subscription error:', error);
  }

  return { data };
};
