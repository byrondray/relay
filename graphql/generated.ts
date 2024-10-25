export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ApprovedCarpooler = {
  __typename?: 'ApprovedCarpooler';
  childFirstName: Scalars['String']['output'];
  parentName: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  sessionId: Scalars['String']['output'];
};

export type Carpool = {
  __typename?: 'Carpool';
  createdAt: Scalars['String']['output'];
  departureDate: Scalars['String']['output'];
  departureTime: Scalars['String']['output'];
  driverId: Scalars['String']['output'];
  endAddress: Scalars['String']['output'];
  endLat: Scalars['Float']['output'];
  endLon: Scalars['Float']['output'];
  estimatedTime?: Maybe<Scalars['String']['output']>;
  extraCarSeat: Scalars['Boolean']['output'];
  groupId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  startAddress: Scalars['String']['output'];
  startLat: Scalars['Float']['output'];
  startLon: Scalars['Float']['output'];
  tripPreferences?: Maybe<Scalars['String']['output']>;
  vehicleId: Scalars['String']['output'];
  winterTires: Scalars['Boolean']['output'];
};

export type CarpoolWithCarpoolers = {
  __typename?: 'CarpoolWithCarpoolers';
  approvedCarpoolers?: Maybe<Array<ApprovedCarpooler>>;
  departureDate: Scalars['String']['output'];
  departureTime: Scalars['String']['output'];
  driverId: Scalars['String']['output'];
  endAddress: Scalars['String']['output'];
  groupId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  startAddress: Scalars['String']['output'];
  vehicleId: Scalars['String']['output'];
};

export type Child = {
  __typename?: 'Child';
  createdAt: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  schoolEmailAddress?: Maybe<Scalars['String']['output']>;
  schoolId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type CommunityCenter = {
  __typename?: 'CommunityCenter';
  address: Scalars['String']['output'];
  distance: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  messages: Array<Message>;
  recipientName: Scalars['String']['output'];
};

export type CreateCarpoolInput = {
  departureDate: Scalars['String']['input'];
  departureTime: Scalars['String']['input'];
  driverId: Scalars['String']['input'];
  endAddress: Scalars['String']['input'];
  endLat: Scalars['Float']['input'];
  endLon: Scalars['Float']['input'];
  extraCarSeat?: InputMaybe<Scalars['Boolean']['input']>;
  groupId: Scalars['String']['input'];
  startAddress: Scalars['String']['input'];
  startLat: Scalars['Float']['input'];
  startLon: Scalars['Float']['input'];
  tripPreferences?: InputMaybe<Scalars['String']['input']>;
  vehicleId: Scalars['String']['input'];
  winterTires?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateRequestInput = {
  carpoolId?: InputMaybe<Scalars['String']['input']>;
  childId: Scalars['String']['input'];
  parentId: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['ID']['output'];
  members: Array<User>;
  name: Scalars['String']['output'];
};

export type GroupMessage = {
  __typename?: 'GroupMessage';
  createdAt: Scalars['String']['output'];
  groupId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type LocationData = {
  __typename?: 'LocationData';
  lat: Scalars['Float']['output'];
  lon: Scalars['Float']['output'];
  senderId: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  recipientId: Scalars['String']['output'];
  senderId: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMemberToGroup: Scalars['String']['output'];
  approveRequest: Request;
  createCarpool: Carpool;
  createChild: Child;
  createGroup: Group;
  createGroupMessage: GroupMessage;
  createMessage: Message;
  createRequest: Request;
  createUser: AuthPayload;
  createVehicle: Vehicle;
  deleteMemberFromGroup: Scalars['String']['output'];
  login: AuthPayload;
  sendLocation?: Maybe<LocationData>;
  updateExpoPushToken: User;
  updateUserInfo: User;
};


export type MutationAddMemberToGroupArgs = {
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationApproveRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationCreateCarpoolArgs = {
  input: CreateCarpoolInput;
};


export type MutationCreateChildArgs = {
  firstName: Scalars['String']['input'];
  schoolEmailAddress?: InputMaybe<Scalars['String']['input']>;
  schoolName: Scalars['String']['input'];
};


export type MutationCreateGroupArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateGroupMessageArgs = {
  groupId: Scalars['String']['input'];
  message: Scalars['String']['input'];
};


export type MutationCreateMessageArgs = {
  recipientId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type MutationCreateRequestArgs = {
  input: CreateRequestInput;
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  expoPushToken?: InputMaybe<Scalars['String']['input']>;
  firebaseId: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateVehicleArgs = {
  color: Scalars['String']['input'];
  licensePlate: Scalars['String']['input'];
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  seats: Scalars['Int']['input'];
  year: Scalars['String']['input'];
};


export type MutationDeleteMemberFromGroupArgs = {
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  expoPushToken?: InputMaybe<Scalars['String']['input']>;
  firebaseId: Scalars['String']['input'];
};


export type MutationSendLocationArgs = {
  carpoolId: Scalars['String']['input'];
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
};


export type MutationUpdateExpoPushTokenArgs = {
  expoPushToken: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationUpdateUserInfoArgs = {
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  filterSchoolsByName: Array<School>;
  getCarpoolsByGroup?: Maybe<Array<Carpool>>;
  getCarpoolsByGroupsWithApprovedCarpoolers?: Maybe<Array<CarpoolWithCarpoolers>>;
  getChild?: Maybe<Child>;
  getChildren: Array<Child>;
  getChildrenForUser: Array<Child>;
  getCommunityCenters: Array<CommunityCenter>;
  getConversationsForUser: Array<Conversation>;
  getCurrentCarpools?: Maybe<Array<Carpool>>;
  getGroup?: Maybe<Group>;
  getGroupMessages: Array<GroupMessage>;
  getGroupWithUsers: Group;
  getGroups: Array<Group>;
  getPastCarpools?: Maybe<Array<Carpool>>;
  getPrivateMessageConversation: Array<Message>;
  getUser?: Maybe<User>;
  getUsers: Array<User>;
  getVehicle?: Maybe<Vehicle>;
  getVehicleForUser: Array<Vehicle>;
  hasUserOnBoarded: Scalars['Boolean']['output'];
};


export type QueryFilterSchoolsByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetCarpoolsByGroupArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryGetCarpoolsByGroupsWithApprovedCarpoolersArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryGetChildArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCommunityCentersArgs = {
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
};


export type QueryGetConversationsForUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetCurrentCarpoolsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGroupMessagesArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryGetGroupWithUsersArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPastCarpoolsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetPrivateMessageConversationArgs = {
  recipientId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVehicleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVehicleForUserArgs = {
  userId: Scalars['String']['input'];
};

export type Request = {
  __typename?: 'Request';
  carpoolId?: Maybe<Scalars['String']['output']>;
  childId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isApproved: Scalars['Boolean']['output'];
  parentId: Scalars['String']['output'];
};

export type School = {
  __typename?: 'School';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  districtNumber: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  locationReceived?: Maybe<LocationData>;
  messageSent: Message;
};


export type SubscriptionLocationReceivedArgs = {
  recipientId: Scalars['String']['input'];
};


export type SubscriptionMessageSentArgs = {
  recipientId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  expoPushToken?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
};

export type Vehicle = {
  __typename?: 'Vehicle';
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  licensePlate: Scalars['String']['output'];
  make: Scalars['String']['output'];
  model: Scalars['String']['output'];
  seats: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
  year: Scalars['String']['output'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName?: string | null, email: string, phoneNumber?: string | null, city?: string | null }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, firstName: string, lastName?: string | null, email: string, phoneNumber?: string | null, city?: string | null } | null };

export type CreateUserMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firebaseId: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', id: string, firstName: string, lastName?: string | null, email: string, sessionId: string } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  firebaseId: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', id: string, firstName: string, lastName?: string | null, email: string, sessionId: string } };

export type UpdateExpoPushTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
}>;


export type UpdateExpoPushTokenMutation = { __typename?: 'Mutation', updateExpoPushToken: { __typename?: 'User', id: string, firstName: string, lastName?: string | null, email: string, expoPushToken?: string | null } };

export type GetConversationsForUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetConversationsForUserQuery = { __typename?: 'Query', getConversationsForUser: Array<{ __typename?: 'Conversation', recipientName: string, messages: Array<{ __typename?: 'Message', id: string, senderId: string, recipientId: string, text: string, createdAt: string }> }> };

export type GetPrivateMessageConversationQueryVariables = Exact<{
  senderId: Scalars['String']['input'];
  recipientId: Scalars['String']['input'];
}>;


export type GetPrivateMessageConversationQuery = { __typename?: 'Query', getPrivateMessageConversation: Array<{ __typename?: 'Message', id: string, senderId: string, recipientId: string, text: string, createdAt: string }> };

export type CreateMessageMutationVariables = Exact<{
  senderId: Scalars['String']['input'];
  recipientId: Scalars['String']['input'];
  text: Scalars['String']['input'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'Message', id: string, senderId: string, recipientId: string, text: string, createdAt: string } };

export type OnMessageSentSubscriptionVariables = Exact<{
  recipientId: Scalars['String']['input'];
}>;


export type OnMessageSentSubscription = { __typename?: 'Subscription', messageSent: { __typename?: 'Message', id: string, senderId: string, recipientId: string, text: string, createdAt: string } };

export type GetCommunityCentersQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
}>;


export type GetCommunityCentersQuery = { __typename?: 'Query', getCommunityCenters: Array<{ __typename?: 'CommunityCenter', id: string, name: string, address: string, lat: number, lon: number, distance: number }> };

export type FilterSchoolsByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type FilterSchoolsByNameQuery = { __typename?: 'Query', filterSchoolsByName: Array<{ __typename?: 'School', id: string, districtNumber: number, name: string, address: string, city: string }> };

export type GetVehicleQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVehicleQuery = { __typename?: 'Query', getVehicle?: { __typename?: 'Vehicle', id: string, userId: string, make: string, model: string, year: string, licensePlate: string, color: string, seats: number } | null };

export type GetVehicleForUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetVehicleForUserQuery = { __typename?: 'Query', getVehicleForUser: Array<{ __typename?: 'Vehicle', id: string, userId: string, make: string, model: string, year: string, licensePlate: string, color: string, seats: number }> };

export type CreateVehicleMutationVariables = Exact<{
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  year: Scalars['String']['input'];
  licensePlate: Scalars['String']['input'];
  color: Scalars['String']['input'];
  seats: Scalars['Int']['input'];
}>;


export type CreateVehicleMutation = { __typename?: 'Mutation', createVehicle: { __typename?: 'Vehicle', id: string, userId: string, make: string, model: string, year: string, licensePlate: string, color: string, seats: number } };

export type GetGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGroupQuery = { __typename?: 'Query', getGroup?: { __typename?: 'Group', id: string, name: string } | null };

export type GetGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGroupsQuery = { __typename?: 'Query', getGroups: Array<{ __typename?: 'Group', id: string, name: string }> };

export type GetGroupWithUsersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGroupWithUsersQuery = { __typename?: 'Query', getGroupWithUsers: { __typename?: 'Group', id: string, name: string, members: Array<{ __typename?: 'User', id: string, firstName: string, lastName?: string | null }> } };

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'Group', id: string, name: string } };

export type AddMemberToGroupMutationVariables = Exact<{
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type AddMemberToGroupMutation = { __typename?: 'Mutation', addMemberToGroup: string };

export type DeleteMemberFromGroupMutationVariables = Exact<{
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type DeleteMemberFromGroupMutation = { __typename?: 'Mutation', deleteMemberFromGroup: string };

export type GetGroupMessagesQueryVariables = Exact<{
  groupId: Scalars['String']['input'];
}>;


export type GetGroupMessagesQuery = { __typename?: 'Query', getGroupMessages: Array<{ __typename?: 'GroupMessage', id: string, groupId: string, userId: string, message: string, createdAt: string }> };

export type CreateGroupMessageMutationVariables = Exact<{
  groupId: Scalars['String']['input'];
  message: Scalars['String']['input'];
}>;


export type CreateGroupMessageMutation = { __typename?: 'Mutation', createGroupMessage: { __typename?: 'GroupMessage', id: string, groupId: string, userId: string, message: string, createdAt: string } };

export type GetChildQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetChildQuery = { __typename?: 'Query', getChild?: { __typename?: 'Child', id: string, userId: string, firstName: string, schoolId: string, schoolEmailAddress?: string | null, createdAt: string } | null };

export type GetChildrenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChildrenQuery = { __typename?: 'Query', getChildren: Array<{ __typename?: 'Child', id: string, userId: string, firstName: string, schoolId: string, schoolEmailAddress?: string | null, createdAt: string }> };

export type GetChildrenForUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChildrenForUserQuery = { __typename?: 'Query', getChildrenForUser: Array<{ __typename?: 'Child', id: string, userId: string, firstName: string, schoolId: string, schoolEmailAddress?: string | null, createdAt: string }> };

export type CreateChildMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  schoolName: Scalars['String']['input'];
  schoolEmailAddress?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateChildMutation = { __typename?: 'Mutation', createChild: { __typename?: 'Child', id: string, userId: string, firstName: string, schoolId: string, schoolEmailAddress?: string | null, createdAt: string } };

export type UpdateUserInfoMutationVariables = Exact<{
  id: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserInfoMutation = { __typename?: 'Mutation', updateUserInfo: { __typename?: 'User', id: string, firstName: string, lastName?: string | null, email: string, phoneNumber?: string | null, city?: string | null } };

export type HasUserOnBoardedQueryVariables = Exact<{ [key: string]: never; }>;


export type HasUserOnBoardedQuery = { __typename?: 'Query', hasUserOnBoarded: boolean };

export type GetCarpoolsByGroupQueryVariables = Exact<{
  groupId: Scalars['String']['input'];
}>;


export type GetCarpoolsByGroupQuery = { __typename?: 'Query', getCarpoolsByGroup?: Array<{ __typename?: 'Carpool', id: string, driverId: string, vehicleId: string, startAddress: string, endAddress: string, startLat: number, startLon: number, endLat: number, endLon: number, departureDate: string, departureTime: string, extraCarSeat: boolean, winterTires: boolean, tripPreferences?: string | null, estimatedTime?: string | null }> | null };

export type GetPastCarpoolsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetPastCarpoolsQuery = { __typename?: 'Query', getPastCarpools?: Array<{ __typename?: 'Carpool', id: string, driverId: string, vehicleId: string, startAddress: string, endAddress: string, startLat: number, startLon: number, endLat: number, endLon: number, departureDate: string, departureTime: string }> | null };

export type GetCurrentCarpoolsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetCurrentCarpoolsQuery = { __typename?: 'Query', getCurrentCarpools?: Array<{ __typename?: 'Carpool', id: string, driverId: string, vehicleId: string, startAddress: string, endAddress: string, startLat: number, startLon: number, endLat: number, endLon: number, departureDate: string, departureTime: string }> | null };

export type GetCarpoolsByGroupsWithApprovedCarpoolersQueryVariables = Exact<{
  groupId: Scalars['String']['input'];
}>;


export type GetCarpoolsByGroupsWithApprovedCarpoolersQuery = { __typename?: 'Query', getCarpoolsByGroupsWithApprovedCarpoolers?: Array<{ __typename?: 'CarpoolWithCarpoolers', id: string, driverId: string, startAddress: string, endAddress: string, departureDate: string, departureTime: string, approvedCarpoolers?: Array<{ __typename?: 'ApprovedCarpooler', parentName: string, childFirstName: string }> | null }> | null };

export type CreateCarpoolMutationVariables = Exact<{
  input: CreateCarpoolInput;
}>;


export type CreateCarpoolMutation = { __typename?: 'Mutation', createCarpool: { __typename?: 'Carpool', id: string, driverId: string, vehicleId: string, startAddress: string, endAddress: string, startLat: number, startLon: number, endLat: number, endLon: number, departureDate: string, departureTime: string, extraCarSeat: boolean, winterTires: boolean, tripPreferences?: string | null, estimatedTime?: string | null } };

export type CreateRequestMutationVariables = Exact<{
  input: CreateRequestInput;
}>;


export type CreateRequestMutation = { __typename?: 'Mutation', createRequest: { __typename?: 'Request', id: string, parentId: string, childId: string, carpoolId?: string | null, isApproved: boolean, createdAt: string } };

export type ApproveRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type ApproveRequestMutation = { __typename?: 'Mutation', approveRequest: { __typename?: 'Request', id: string, parentId: string, childId: string, carpoolId?: string | null, isApproved: boolean, createdAt: string } };

export type SendLocationMutationVariables = Exact<{
  carpoolId: Scalars['String']['input'];
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
}>;


export type SendLocationMutation = { __typename?: 'Mutation', sendLocation?: { __typename?: 'LocationData', lat: number, lon: number, senderId: string, timestamp: string } | null };

export type OnLocationReceivedSubscriptionVariables = Exact<{
  recipientId: Scalars['String']['input'];
}>;


export type OnLocationReceivedSubscription = { __typename?: 'Subscription', locationReceived?: { __typename?: 'LocationData', lat: number, lon: number, senderId: string, timestamp: string } | null };
