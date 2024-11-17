/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/Carpool/NewRide` | `/(tabs)/Carpool/createRide` | `/(tabs)/Carpool/postRequest` | `/(tabs)/Carpool/selectPassenger` | `/(tabs)/Carpool/selectPassengerList` | `/(tabs)/Community/community` | `/(tabs)/settings` | `/(tabs)/temp` | `/(tabs)/trips/listcarpool` | `/..\components\rideInProgress\reviewInfo` | `/Carpool/NewRide` | `/Carpool/createRide` | `/Carpool/postRequest` | `/Carpool/selectPassenger` | `/Carpool/selectPassengerList` | `/Community/community` | `/Login/login` | `/OnboardForms/child` | `/OnboardForms/parent` | `/OnboardForms/vehicle` | `/Register/register` | `/_sitemap` | `/settings` | `/temp` | `/theme` | `/trips/listcarpool`;
      DynamicRoutes: `/(tabs)/messages/${Router.SingleRoutePart<T>}` | `/(tabs)/messages/group/${Router.SingleRoutePart<T>}` | `/(tabs)/trips/inProgress/${Router.SingleRoutePart<T>}` | `/messages/${Router.SingleRoutePart<T>}` | `/messages/group/${Router.SingleRoutePart<T>}` | `/trips/inProgress/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/messages/[userId]` | `/(tabs)/messages/group/[groupId]` | `/(tabs)/trips/inProgress/[trip]` | `/messages/[userId]` | `/messages/group/[groupId]` | `/trips/inProgress/[trip]`;
    }
  }
}
