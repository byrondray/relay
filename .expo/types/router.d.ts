/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/group/addMembers` | `/(tabs)/group/createGroup` | `/(tabs)/group/viewGroup` | `/Login/login` | `/OnboardForms/child` | `/OnboardForms/parent` | `/OnboardForms/vehicle` | `/Register/register` | `/_sitemap` | `/group/addMembers` | `/group/createGroup` | `/group/viewGroup`;
      DynamicRoutes: `/(tabs)/messages/${Router.SingleRoutePart<T>}` | `/messages/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/messages/[userId]` | `/messages/[userId]`;
    }
  }
}
