import { gql } from "@apollo/client";

// Query that grabs a friend by their ID
export const GET_FRIEND = gql`
  query GetFriend($friendId: String!) {
    getFriend(friendId: $friendId) {
      id
      userId
      createdAt
      friends {
        id
        firstName
        lastName
        email
        phoneNumber
        licenseImageUrl
        insuranceImageUrl
        city
        createdAt
        imageUrl
      }
    }
  }
`;

// Query that grabs all friends
export const GET_FRIENDS = gql`
  query GetFriends {
    getFriends {
      id
      userId
      createdAt
      friends {
        id
        firstName
        lastName
        email
        phoneNumber
        licenseImageUrl
        insuranceImageUrl
        city
        createdAt
        imageUrl
      }
    }
  }
`;

// Mutation to add a friend
export const ADD_FRIEND = gql`
  mutation AddFriend($friendId: String!) {
    addFriend(friendId: $friendId) {
      message
    }
  }
`;

// Mutation to delete a friend
export const DELETE_FRIEND = gql`
  mutation DeleteFriend($friendId: String!) {
    deleteFriend(friendId: $friendId) {
      message
    }
  }
`;
