import { gql } from "@apollo/client";

export const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      schoolId
      communityCenterId
    }
  }
`;

// Query to get all groups
export const GET_GROUPS = gql`
  query GetGroups {
    getGroups {
      id
      name
      schoolId
      communityCenterId
      members {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// Query to get a group with its members
export const GET_GROUP_WITH_USERS = gql`
  query GetGroupWithUsers($id: ID!) {
    getGroupWithUsers(id: $id) {
      id
      name
      schoolId
      communityCenterId
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
      schoolId
      communityCenterId
    }
  }
`;

// Mutation to add a member to a group
export const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup($groupId: String!, $userId: String!) {
    addMemberToGroup(groupId: $groupId, userId: $userId) {
      message
    }
  }
`;

// Mutation to remove a member from a group
export const DELETE_MEMBER_FROM_GROUP = gql`
  mutation DeleteMemberFromGroup($groupId: String!, $userId: String!) {
    deleteMemberFromGroup(groupId: $groupId, userId: $userId) {
      message
    }
  }
`;
