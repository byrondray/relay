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

export type AuthPayload = {
  __typename?: 'AuthPayload';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  sessionId: Scalars['String']['output'];
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
  createChild: Child;
  createGroup: Group;
  createGroupMessage: GroupMessage;
  createMessage: Message;
  createUser: AuthPayload;
  createVehicle: Vehicle;
  deleteMemberFromGroup: Scalars['String']['output'];
  login: AuthPayload;
  updateExpoPushToken: User;
};


export type MutationAddMemberToGroupArgs = {
  groupId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationCreateChildArgs = {
  firstName: Scalars['String']['input'];
  schoolEmailAddress?: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
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


export type MutationUpdateExpoPushTokenArgs = {
  expoPushToken: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  filterSchoolsByName: Array<School>;
  getChild?: Maybe<Child>;
  getChildren: Array<Child>;
  getChildrenForUser: Array<Child>;
  getCommunityCenters: Array<CommunityCenter>;
  getConversationsForUser: Array<Conversation>;
  getGroup?: Maybe<Group>;
  getGroupMessages: Array<GroupMessage>;
  getGroupWithUsers: Group;
  getGroups: Array<Group>;
  getPrivateMessageConversation: Array<Message>;
  getUser?: Maybe<User>;
  getUsers: Array<User>;
  getVehicle?: Maybe<Vehicle>;
  getVehicleForUser: Array<Vehicle>;
};


export type QueryFilterSchoolsByNameArgs = {
  name: Scalars['String']['input'];
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


export type QueryGetGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGroupMessagesArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryGetGroupWithUsersArgs = {
  id: Scalars['ID']['input'];
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
  messageSent: Message;
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
  userId: Scalars['String']['output'];
  year: Scalars['String']['output'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName?: string | null, email: string }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, firstName: string, lastName?: string | null, email: string } | null };

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


export type GetVehicleQuery = { __typename?: 'Query', getVehicle?: { __typename?: 'Vehicle', id: string, userId: string, make: string, model: string, year: string, licensePlate: string, color: string } | null };

export type GetVehicleForUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetVehicleForUserQuery = { __typename?: 'Query', getVehicleForUser: Array<{ __typename?: 'Vehicle', id: string, userId: string, make: string, model: string, year: string, licensePlate: string, color: string }> };

export type CreateVehicleMutationVariables = Exact<{
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  year: Scalars['String']['input'];
  licensePlate: Scalars['String']['input'];
  color: Scalars['String']['input'];
}>;


export type CreateVehicleMutation = { __typename?: 'Mutation', createVehicle: { __typename?: 'Vehicle', id: string, userId: string, make: string, model: string, year: string, licensePlate: string, color: string } };

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
  schoolId: Scalars['String']['input'];
  schoolEmailAddress?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateChildMutation = { __typename?: 'Mutation', createChild: { __typename?: 'Child', id: string, userId: string, firstName: string, schoolId: string, schoolEmailAddress?: string | null, createdAt: string } };
