import { gql } from "@apollo/client";

export const GET_CARPOOLS_BY_GROUP = gql`
  query GetCarpoolsByGroup($groupId: String!) {
    getCarpoolsByGroup(groupId: $groupId) {
      id
      driverId
      vehicleId
      startAddress
      endAddress
      startLat
      startLon
      endLat
      endLon
      departureDate
      departureTime
      extraCarSeat
      winterTires
      tripPreferences
      estimatedTime
    }
  }
`;

// Query to get past carpools for a user
export const GET_PAST_CARPOOLS = gql`
  query GetPastCarpools($userId: String!) {
    getPastCarpools(userId: $userId) {
      id
      driverId
      vehicleId
      startAddress
      endAddress
      startLat
      startLon
      endLat
      endLon
      departureDate
      departureTime
    }
  }
`;

// Query to get current and upcoming carpools for a user
export const GET_CURRENT_CARPOOLS = gql`
  query GetCurrentCarpools($userId: String!) {
    getCurrentCarpools(userId: $userId) {
      id
      driverId
      vehicleId
      startAddress
      endAddress
      startLat
      startLon
      endLat
      endLon
      departureDate
      departureTime
    }
  }
`;

// Query to get carpools by group with approved carpoolers
export const GET_CARPOOLS_BY_GROUP_WITH_APPROVED_CARPOOLERS = gql`
  query GetCarpoolsByGroupsWithApprovedCarpoolers($groupId: String!) {
    getCarpoolsByGroupsWithApprovedCarpoolers(groupId: $groupId) {
      id
      driverId
      startAddress
      endAddress
      departureDate
      departureTime
      approvedCarpoolers {
        parentName
        childFirstName
      }
    }
  }
`;

// Mutation to create a new carpool
export const CREATE_CARPOOL = gql`
  mutation CreateCarpool($input: CreateCarpoolInput!) {
    createCarpool(input: $input) {
      id
      driverId
      vehicleId
      startAddress
      endAddress
      startLat
      startLon
      endLat
      endLon
      departureDate
      departureTime
      extraCarSeat
      winterTires
      tripPreferences
      estimatedTime
    }
  }
`;

// Mutation to create a new carpool request
export const CREATE_REQUEST = gql`
  mutation CreateRequest($input: CreateRequestInput!) {
    createRequest(input: $input) {
      id
      parentId
      carpoolId
      isApproved
      createdAt
      children {
        id
        firstName
        schoolId
        schoolEmailAddress
        imageUrl
      }
    }
  }
`;

// Mutation to approve a carpool request
export const APPROVE_REQUEST = gql`
  mutation ApproveRequest($requestId: String!) {
    approveRequest(requestId: $requestId) {
      id
      parentId
      carpoolId
      isApproved
      createdAt
      children {
        id
        firstName
        schoolId
        schoolEmailAddress
        imageUrl
      }
    }
  }
`;

export const GET_CARPOOLERS_WITHOUT_APPROVED_REQUESTS = gql`
  query GetCarpoolersWithoutApprovedRequests(
    $groupId: String!
    $date: String!
    $time: String!
    $endingAddress: String!
  ) {
    getCarpoolersByGroupWithoutApprovedRequests(
      groupId: $groupId
      date: $date
      time: $time
      endingAddress: $endingAddress
    ) {
      id
      carpoolId
      parentId
      groupId
      isApproved
      startAddress
      endAddress
      startingLat
      startingLon
      endingLat
      endingLon
      pickupTime
      createdAt
      children {
        id
        firstName
        schoolId
        schoolEmailAddress
        imageUrl
        parent {
          id
          firstName
          lastName
          email
          phoneNumber
          imageUrl
          licenseImageUrl
          insuranceImageUrl
          city
          createdAt
          expoPushToken
        }
      }
    }
  }
`;

export const GET_CARPOOL_WITH_REQUESTS = gql`
  query GetCarpoolWithRequests($carpoolId: String!) {
    getCarpoolWithRequests(carpoolId: $carpoolId) {
      id
      driverId
      vehicleId
      groupId
      startAddress
      endAddress
      departureDate
      departureTime
      startLat
      startLon
      endLat
      endLon
      requests {
        id
        startAddress
        startLat
        startLon
        parent {
          id
          firstName
          email
          imageUrl
        }
        child {
          id
          firstName
          schoolId
          imageUrl
        }
      }
    }
  }
`;

export const GET_USER_CARPOOL_WITH_REQUESTS = gql`
  query GetUserCarpoolsAndRequests($userId: String!) {
    getUserCarpoolsAndRequests(userId: $userId) {
      carpools {
        id
        vehicle {
          id
          make
          model
          year
          licensePlate
        }
        driver {
          id
          firstName
          lastName
          email
          phoneNumber
          imageUrl
        }
        groupId
        startAddress
        endAddress
        startLat
        startLon
        endLat
        endLon
        departureDate
        departureTime
        extraCarSeat
        tripPreferences
        estimatedTime
      }
      requests {
        id
        carpoolId
        pickupTime
        startAddress
        parent {
          id
          firstName
          email
          imageUrl
        }
        child {
          id
          firstName
          schoolId
          imageUrl
        }
        carpool {
          id
          startAddress
          endAddress
          departureDate
          departureTime
          driverId
          vehicleId
          groupId
          startLat
          startLon
          endLat
          endLon
        }
        driver {
          id
          firstName
          lastName
          email
          phoneNumber
          imageUrl
        }
        vehicle {
          id
          make
          model
          year
          licensePlate
        }
      }
    }
  }
`;
