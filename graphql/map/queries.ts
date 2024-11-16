import { gql } from "@apollo/client";

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

export const SEND_LOCATION = gql`
  mutation SendLocation($carpoolId: String!, $lat: Float!, $lon: Float!) {
    sendLocation(carpoolId: $carpoolId, lat: $lat, lon: $lon) {
      lat
      lon
      senderId
      timestamp
    }
  }
`;

export const LOCATION_RECEIVED_SUBSCRIPTION = gql`
  subscription LocationReceived($recipientId: String!) {
    locationReceived(recipientId: $recipientId) {
      senderId
      lat
      lon
      timestamp
    }
  }
`;
