import { gql } from "@apollo/client";

// export const GET_FRIEND = gql`
//   query GetFriend($userId: String!, $friendId: String!) {
//     getFriend(userId: $userId, friendId: $friendId) {
//       id
//       userId
//       createdAt
//       friends {
//         id
//         firstName
//         lastName
//         email
//         phoneNumber
//         licenseImageUrl
//         insuranceImageUrl
//         city
//         createdAt
//         imageUrl
//       }
//     }
//   }
// `;

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
