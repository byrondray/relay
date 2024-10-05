import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $firebaseId: String!) {
    createUser(name: $name, email: $email, firebaseId: $firebaseId) {
      id
      name
      email
      sessionId
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $firebaseId: String!) {
    login(email: $email, firebaseId: $firebaseId) {
      id
      name
      email
      sessionId
    }
  }
`;
