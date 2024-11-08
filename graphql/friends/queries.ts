import { gql } from "@apollo/client";

export const GET_FRIENDS = gql`
  query GetFriends($userId: String!) {
    getFriends(userId: $userId) {
      id
      firstName
      lastName
      email
      imageUrl
    }
  }
`;