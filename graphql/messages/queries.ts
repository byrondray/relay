import { gql } from "@apollo/client";

export const GET_CONVERSATIONS_FOR_USER = gql`
  query GetConversationsForUser($userId: String!) {
    getConversationsForUser(userId: $userId) {
      recipientName
      messages {
        id
        text
        createdAt
        sender {
          id
          firstName
          lastName
          email
          imageUrl
        }
        recipient {
          id
          firstName
          lastName
          email
          imageUrl
        }
      }
    }
  }
`;

// Query to get a private conversation between two users
export const GET_PRIVATE_MESSAGE_CONVERSATION = gql`
  query GetPrivateMessageConversation(
    $senderId: String!
    $recipientId: String!
  ) {
    getPrivateMessageConversation(
      senderId: $senderId
      recipientId: $recipientId
    ) {
      id
      text
      createdAt
      sender {
        id
        firstName
        lastName
        email
        imageUrl
      }
      recipient {
        id
        firstName
        lastName
        email
        imageUrl
      }
    }
  }
`;

// Mutation to create a new message between two users
export const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $senderId: String!
    $recipientId: String!
    $text: String!
  ) {
    createMessage(senderId: $senderId, recipientId: $recipientId, text: $text) {
      id
      text
      createdAt
      sender {
        id
        firstName
        lastName
        email
        imageUrl
      }
      recipient {
        id
        firstName
        lastName
        email
        imageUrl
      }
    }
  }
`;

// Subscription to listen for new messages
export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription OnMessageSent($recipientId: String!) {
    messageSent(recipientId: $recipientId) {
      id
      text
      createdAt
      sender {
        id
        firstName
        lastName
        email
        imageUrl
      }
      recipient {
        id
        firstName
        lastName
        email
        imageUrl
      }
    }
  }
`;

export const GET_GROUP_MESSAGES = gql`
  query GetGroupMessages($groupId: String!) {
    getGroupMessages(groupId: $groupId) {
      id
      groupId
      userId
      message
      createdAt
    }
  }
`;

// Mutation to create a group message
export const CREATE_GROUP_MESSAGE = gql`
  mutation CreateGroupMessage($groupId: String!, $message: String!) {
    createGroupMessage(groupId: $groupId, message: $message) {
      id
      groupId
      userId
      message
      createdAt
    }
  }
`;
