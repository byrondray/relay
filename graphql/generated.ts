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
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
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
  messages: Scalars['String']['output'];
  recipientName: Scalars['String']['output'];
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
  createMessage: Message;
  createUser: AuthPayload;
  login: AuthPayload;
  updateExpoPushToken: User;
};


export type MutationCreateMessageArgs = {
  recipientId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
  firebaseId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
  firebaseId: Scalars['String']['input'];
};


export type MutationUpdateExpoPushTokenArgs = {
  expoPushToken: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  filterSchoolsByName: Array<School>;
  getCommunityCenters: Array<CommunityCenter>;
  getConversationsForUser: Array<Conversation>;
  getPrivateMessageConversation: Array<Message>;
  getUser?: Maybe<User>;
  getUsers: Array<User>;
};


export type QueryFilterSchoolsByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetCommunityCentersArgs = {
  lat: Scalars['Float']['input'];
  lon: Scalars['Float']['input'];
};


export type QueryGetConversationsForUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetPrivateMessageConversationArgs = {
  recipientId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
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
  email: Scalars['String']['output'];
  expoPushToken: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', id: string, name: string, email: string }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, name: string, email: string } | null };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firebaseId: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthPayload', id: string, name: string, email: string, sessionId: string } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  firebaseId: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', id: string, name: string, email: string, sessionId: string } };

export type UpdateExpoPushTokenMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  expoPushToken: Scalars['String']['input'];
}>;


export type UpdateExpoPushTokenMutation = { __typename?: 'Mutation', updateExpoPushToken: { __typename?: 'User', id: string, name: string, email: string, expoPushToken: string } };

export type GetConversationsForUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetConversationsForUserQuery = { __typename?: 'Query', getConversationsForUser: Array<{ __typename?: 'Conversation', recipientName: string, messages: string }> };

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
