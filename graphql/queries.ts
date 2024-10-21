import { gql } from "@apollo/client";

// Query to get all users
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      email
    }
  }
`;

// Query to get a single user by ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

// Mutation to create a new user
export const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String
    $email: String!
    $firebaseId: String!
    $expoPushToken: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      firebaseId: $firebaseId
      expoPushToken: $expoPushToken
    ) {
      id
      firstName
      lastName
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
      firstName
      lastName
      email
      sessionId
    }
  }
`;

export const UPDATE_EXPO_PUSH_TOKEN = gql`
  mutation UpdateExpoPushToken($userId: String!, $expoPushToken: String!) {
    updateExpoPushToken(userId: $userId, expoPushToken: $expoPushToken) {
      id
      firstName
      lastName
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
      messages {
        id
        senderId
        recipientId
        text
        createdAt
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

// Query to get a vehicle by ID
export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
      id
      userId
      make
      model
      year
      licensePlate
      color
    }
  }
`;

// Query to get all vehicles for a user
export const GET_VEHICLE_FOR_USER = gql`
  query GetVehicleForUser($userId: String!) {
    getVehicleForUser(userId: $userId) {
      id
      userId
      make
      model
      year
      licensePlate
      color
    }
  }
`;

// Mutation to create a vehicle
export const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $make: String!
    $model: String!
    $year: String!
    $licensePlate: String!
    $color: String!
  ) {
    createVehicle(
      make: $make
      model: $model
      year: $year
      licensePlate: $licensePlate
      color: $color
    ) {
      id
      userId
      make
      model
      year
      licensePlate
      color
    }
  }
`;

// Query to get a group by ID
export const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
    }
  }
`;

// Query to get all groups
export const GET_GROUPS = gql`
  query GetGroups {
    getGroups {
      id
      name
    }
  }
`;

// Query to get a group with its members
export const GET_GROUP_WITH_USERS = gql`
  query GetGroupWithUsers($id: ID!) {
    getGroupWithUsers(id: $id) {
      id
      name
      members {
        id
        firstName
        lastName
      }
    }
  }
`;

// Mutation to create a group
export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!) {
    createGroup(name: $name) {
      id
      name
    }
  }
`;

// Mutation to add a member to a group
export const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup($groupId: String!, $userId: String!) {
    addMemberToGroup(groupId: $groupId, userId: $userId)
  }
`;

// Mutation to remove a member from a group
export const DELETE_MEMBER_FROM_GROUP = gql`
  mutation DeleteMemberFromGroup($groupId: String!, $userId: String!) {
    deleteMemberFromGroup(groupId: $groupId, userId: $userId)
  }
`;

// Query to get all group messages by groupId
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

// Query to get a child by ID
export const GET_CHILD = gql`
  query GetChild($id: ID!) {
    getChild(id: $id) {
      id
      userId
      firstName
      schoolId
      schoolEmailAddress
      createdAt
    }
  }
`;

// Query to get all children
export const GET_CHILDREN = gql`
  query GetChildren {
    getChildren {
      id
      userId
      firstName
      schoolId
      schoolEmailAddress
      createdAt
    }
  }
`;

// Query to get children for a user
export const GET_CHILDREN_FOR_USER = gql`
  query GetChildrenForUser {
    getChildrenForUser {
      id
      userId
      firstName
      schoolId
      schoolEmailAddress
      createdAt
    }
  }
`;

// Mutation to create a child
export const CREATE_CHILD = gql`
  mutation CreateChild(
    $firstName: String!
    $schoolId: String!
    $schoolEmailAddress: String
  ) {
    createChild(
      firstName: $firstName
      schoolId: $schoolId
      schoolEmailAddress: $schoolEmailAddress
    ) {
      id
      userId
      firstName
      schoolId
      schoolEmailAddress
      createdAt
    }
  }
`;
