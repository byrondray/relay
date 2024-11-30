import {
  useQuery,
  useMutation,
  useSubscription,
  ApolloError,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GET_GROUP_MESSAGES,
  CREATE_GROUP_MESSAGE,
  GROUP_MESSAGE_SENT,
} from "@/graphql/messages/queries";
import { Alert } from "react-native";
import { GroupMessage } from "@/graphql/generated";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";

export const useFetchGroupMessages = (
  groupId: string,
  setMessages: (messages: GroupMessage[]) => void
) => {
  const { data, loading, error, refetch } = useQuery(GET_GROUP_MESSAGES, {
    variables: { groupId },
    skip: !groupId,
    fetchPolicy: "network-only",
    onCompleted: async (data: { getGroupMessages: GroupMessage[] }) => {
      const fetchedMessages = data.getGroupMessages;

      const uniqueMessages = Array.from(
        new Map(fetchedMessages.map((msg) => [msg.id, msg])).values()
      );
      setMessages(uniqueMessages);

      await AsyncStorage.setItem(
        `group_messages_${groupId}`,
        JSON.stringify(uniqueMessages)
      );
    },
    onError: async (error: ApolloError) => {
      console.error("Failed to fetch group messages:", error);

      const cachedMessages = await AsyncStorage.getItem(
        `group_messages_${groupId}`
      );
      if (cachedMessages) {
        const cachedMessagesParsed: GroupMessage[] = JSON.parse(cachedMessages);
        setMessages(cachedMessagesParsed);
        Alert.alert("Offline Mode", "Loaded group messages from cache.");
      } else {
        Alert.alert(
          "Error",
          "Failed to load group messages. Please check your network."
        );
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (groupId) {
        refetch();
      }
    }, [groupId])
  );

  return { data, loading, error, refetch };
};

export const useSendGroupMessage = (
  groupId: string,
  senderId: string,
  setMessages: (
    messages:
      | GroupMessage[]
      | ((prevMessages: GroupMessage[]) => GroupMessage[])
  ) => void,
  messages: GroupMessage[],
  newMessage: string,
  setNewMessage: (message: string) => void,
  setIsMessageSent: (status: boolean) => void
) => {
  const [createGroupMessage] = useMutation(CREATE_GROUP_MESSAGE);

  const sendMessage = async () => {
    if (newMessage) {
      const messageData = {
        groupId,
        message: newMessage,
      };

      try {
        const { data } = await createGroupMessage({ variables: messageData });

        const createdMessage = data?.createGroupMessage;

        if (createdMessage) {
          setNewMessage("");
          setIsMessageSent(true);

          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (msg) => msg.id === createdMessage.id
            );

            if (isDuplicate) {
              return prevMessages;
            }

            const updatedMessages = [...prevMessages, createdMessage];
            AsyncStorage.setItem(
              `group_messages_${groupId}`,
              JSON.stringify(updatedMessages)
            );

            return updatedMessages;
          });
        } else {
          console.error("Failed to create group message: No message returned");
          Alert.alert("Error", "Group message creation failed on the server.");
        }
      } catch (error) {
        console.error("Send group message error:", error);
        Alert.alert(
          "Error",
          (error as Error).message || "Failed to send group message."
        );
      }
    }
  };

  return { sendMessage };
};

export const useGroupMessageSubscription = (
  groupId: string,
  setMessages: (
    messages:
      | GroupMessage[]
      | ((prevMessages: GroupMessage[]) => GroupMessage[])
  ) => void
) => {
  const { data, error } = useSubscription(GROUP_MESSAGE_SENT, {
    variables: { groupId },
    skip: !groupId,
  });

  useEffect(() => {
    console.log(
      "Attempting to subscribe to group messages for groupId:",
      groupId
    );

    if (data?.groupMessageSent) {
      const newMessage = data.groupMessageSent;

      setMessages((prevMessages: GroupMessage[]) => {
        const isDuplicate = prevMessages.some(
          (msg) => msg.id === newMessage.id
        );

        if (isDuplicate) {
          return prevMessages;
        }

        const updatedMessages = [...prevMessages, newMessage];

        AsyncStorage.setItem(
          `group_messages_${groupId}`,
          JSON.stringify(updatedMessages)
        );

        return updatedMessages;
      });
    }
  }, [data?.groupMessageSent]);

  if (error) {
    console.error("Group message subscription error:", error);
  }

  return { data };
};
