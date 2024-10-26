import { gql } from "@apollo/client";

// Query to get all users
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      email
      phoneNumber
      city
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

// Query to get a group by ID
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
      licenseImageUrl: $licenseImageUrl
      insuranceImageUrl: $insuranceImageUrl
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      city
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

// Query to get carpools by group
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
      childId
      carpoolId
      isApproved
      createdAt
    }
  }
`;

// Mutation to approve a carpool request
export const APPROVE_REQUEST = gql`
  mutation ApproveRequest($requestId: String!) {
    approveRequest(requestId: $requestId) {
      id
      parentId
      childId
      carpoolId
      isApproved
      createdAt
    }
  }
`;

// Mutation to delete a carpool request
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

// Subscription to receive location updates from other carpool members
export const LOCATION_RECEIVED_SUBSCRIPTION = gql`
  subscription OnLocationReceived($recipientId: String!) {
    locationReceived(recipientId: $recipientId) {
      lat
      lon
      senderId
      timestamp
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
      childId
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
    }
  }
`;
