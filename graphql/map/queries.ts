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
  mutation SendLocation(
    $carpoolId: String!
    $lat: Float!
    $lon: Float!
    $nextStop: NextStopInput!
    $timeToNextStop: String!
    $totalTime: String!
    $timeUntilNextStop: String!
    $isLeaving: Boolean!
    $isFinalDestination: Boolean!
  ) {
    sendLocation(
      carpoolId: $carpoolId
      lat: $lat
      lon: $lon
      nextStop: $nextStop
      timeToNextStop: $timeToNextStop
      totalTime: $totalTime
      timeUntilNextStop: $timeUntilNextStop
      isLeaving: $isLeaving
      isFinalDestination: $isFinalDestination
    ) {
      senderId
      lat
      lon
      timestamp
      nextStop {
        address
        requestId
      }
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
      nextStop {
        address
        requestId
      }
    }
  }
`;

export const FOREGROUND_NOTIFICATION_SUBSCRIPTION = gql`
  subscription ForegroundNotification($recipientId: String!) {
    foregroundNotification(recipientId: $recipientId) {
      message
      timestamp
      senderId
    }
  }
`;

export const SEND_NOTIFICATION_INFO = gql`
  mutation SendNotificationInfo(
    $carpoolId: String!
    $notificationType: NotificationType!
    $lat: Float!
    $lon: Float!
    $nextStop: NextStopInput!
    $timeToNextStop: String!
    $timeUntilNextStop: String!
    $isFinalDestination: Boolean!
  ) {
    sendNotificationInfo(
      carpoolId: $carpoolId
      notificationType: $notificationType
      lat: $lat
      lon: $lon
      nextStop: $nextStop
      timeToNextStop: $timeToNextStop
      timeUntilNextStop: $timeUntilNextStop
      isFinalDestination: $isFinalDestination
    )
  }
`;
