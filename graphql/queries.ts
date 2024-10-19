import { gql } from "@apollo/client";

// Query to get all users
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;

// Query to get a single user by ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
    }
  }
`;

// Mutation to create a new user
export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $firebaseId: String!
    $expoPushToken: String!
  ) {
    createUser(
      name: $name
      email: $email
      firebaseId: $firebaseId
      expoPushToken: $expoPushToken
    ) {
      id
      name
      email
      sessionId
    }
  }
`;

// Mutation to log in an existing user
export const LOGIN = gql`
  mutation Login(
    $email: String!
    $firebaseId: String!
    $expoPushToken: String!
  ) {
    login(
      email: $email
      firebaseId: $firebaseId
      expoPushToken: $expoPushToken
    ) {
      id
      name
      email
      sessionId
    }
  }
`;

export const UPDATE_EXPO_PUSH_TOKEN = gql`
  mutation UpdateExpoPushToken($userId: String!, $expoPushToken: String!) {
    updateExpoPushToken(userId: $userId, expoPushToken: $expoPushToken) {
      id
      name
      email
      expoPushToken
    }
  }
`;

// MESSAGE QUERIES AND MUTATIONS

// Query to get all conversations for a user
export const GET_CONVERSATIONS_FOR_USER = gql`
  query GetConversationsForUser($userId: String!) {
    getConversationsForUser(userId: $userId) {
      recipientName
      messages
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
      senderId
      recipientId
      text
      createdAt
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
      senderId
      recipientId
      text
      createdAt
    }
  }
`;

// Subscription to listen for new messages
export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription OnMessageSent($recipientId: String!) {
    messageSent(recipientId: $recipientId) {
      id
      senderId
      recipientId
      text
      createdAt
    }
  }
`;

// Query to get 5 closes community centers
export const GET_COMMUNITY_CENTERS = gql`
  query GetCommunityCenters($lat: Float!, $lon: Float!) {
    getCommunityCenters(lat: $lat, lon: $lon) {
      id
      name
      address
      lat
      lon
      distance
    }
  }
`;

// Query to filter schools by name
export const FILTER_SCHOOLS_BY_NAME = gql`
  query FilterSchoolsByName($name: String!) {
    filterSchoolsByName(name: $name) {
      id
      districtNumber
      name
      address
      city
    }
  }
`;
