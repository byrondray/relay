import { useQuery, useMutation, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GET_PRIVATE_MESSAGE_CONVERSATION,
  CREATE_MESSAGE,
} from '@/graphql/queries';
import { MESSAGE_SENT_SUBSCRIPTION } from '@/graphql/queries';
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
      onCompleted: async (data) => {
        const fetchedMessages = data.getPrivateMessageConversation;
        setMessages(fetchedMessages);

        await AsyncStorage.setItem(
          `messages_${recipientId}`,
          JSON.stringify(fetchedMessages)
        ).then(() => console.log('Messages saved successfully'));
      },
      onError: async (error) => {
        console.error('Failed to fetch messages:', error);

        const cachedMessages = await AsyncStorage.getItem(
          `messages_${recipientId}`
        );
        if (cachedMessages) {
          setMessages(JSON.parse(cachedMessages));
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

export const useSendMessage = (
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void,
  recipientId: string,
  messages: Message[],
  newMessage: string,
  setNewMessage: (message: string) => void,
  setIsMessageSent: (status: boolean) => void
) => {
  const [createMessage] = useMutation(CREATE_MESSAGE);

  const sendMessage = async (senderId: string) => {
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
recipientId: string, setMessages: (
  messages: Message[] | ((prevMessages: Message[]) => Message[])
) => void, messages: Message[], isMessageSent: boolean) => {
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
      ).then(() => console.log('New message added to AsyncStorage'));
    }
  }, [data]);

  if (error) {
    console.error('Subscription error:', error);
  }

  return { data };
};
