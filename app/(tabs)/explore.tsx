import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GetUsersQuery, User as U } from '@/graphql/generated';
import React from 'react';
import { GET_USERS } from '@/graphql/queries';
import { Link, router } from 'expo-router';

export default function TabTwoScreen() {
  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery<GetUsersQuery, { error: Error }>(GET_USERS, { client });

  if (queryLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  if (queryError) return <Text>Error :</Text>;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Ionicons size={310} name='code-slash' style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Explore</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      {queryData && (
        <View>
          {queryData.getUsers.map((user: U) => (
            <Text
              key={user.id}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/messages/[userId]',
                  params: { userId: user.id },
                })
              }
            >
              {user.name} ({user.email})
            </Text>
          ))}
        </View>
      )}

      <Collapsible title='File-based routing'>
        <ThemedText>
          This app has two screens:
          <ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText>
          and
          <ThemedText type='defaultSemiBold'>app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
