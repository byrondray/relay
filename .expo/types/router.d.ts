/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/authScreen` | `/(tabs)/explore` | `/(tabs)/sandbox/sandbox` | `/FirstPage` | `/Login/login` | `/Register/register` | `/SecondPage` | `/_sitemap` | `/authScreen` | `/explore` | `/sandbox/sandbox`;
      DynamicRoutes: `/(tabs)/messages/${Router.SingleRoutePart<T>}` | `/messages/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/messages/[userId]` | `/messages/[userId]`;
    }
  }
}
