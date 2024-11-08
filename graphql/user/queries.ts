import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      email
      phoneNumber
      city
      imageUrl
      licenseImageUrl
      insuranceImageUrl
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
      phoneNumber
      city
      imageUrl
      licenseImageUrl
      insuranceImageUrl
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
      seats
      vehicleImageUrl
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
      seats
      vehicleImageUrl
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
    $seats: Int!
    $imageUrl: String
  ) {
    createVehicle(
      make: $make
      model: $model
      year: $year
      licensePlate: $licensePlate
      color: $color
      seats: $seats
      imageUrl: $imageUrl
    ) {
      id
      userId
      make
      model
      year
      licensePlate
      color
      seats
      vehicleImageUrl
    }
  }
`;

export const GET_CHILD = gql`
  query GetChild($id: ID!) {
    getChild(id: $id) {
      id
      userId
      firstName
      schoolId
      schoolEmailAddress
      createdAt
      imageUrl
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
      imageUrl
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
      imageUrl
    }
  }
`;

// Mutation to create a child
export const CREATE_CHILD = gql`
  mutation CreateChild(
    $firstName: String!
    $schoolName: String!
    $schoolEmailAddress: String
    $imageUrl: String
  ) {
    createChild(
      firstName: $firstName
      schoolName: $schoolName
      schoolEmailAddress: $schoolEmailAddress
      imageUrl: $imageUrl
    ) {
      id
      userId
      firstName
      schoolId
      schoolEmailAddress
      createdAt
      imageUrl
    }
  }
`;

// Mutation to update a User

export const UPDATE_USER = gql`
  mutation UpdateUserInfo(
    $id: String!
    $firstName: String
    $lastName: String
    $email: String
    $phoneNumber: String
    $city: String
    $imageUrl: String
    $licenseImageUrl: String
    $insuranceImageUrl: String
  ) {
    updateUserInfo(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
      city: $city
      imageUrl: $imageUrl
      licenseImageUrl: $licenseImageUrl
      insuranceImageUrl: $insuranceImageUrl
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      city
      imageUrl
      licenseImageUrl
      insuranceImageUrl
    }
  }
`;

export const HAS_USER_ON_BOARDED = gql`
  query HasUserOnBoarded {
    hasUserOnBoarded
  }
`;
