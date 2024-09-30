/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/authScreen` | `/(tabs)/explore` | `/..\codegen` | `/..\graphql\client` | `/..\graphql\generated` | `/..\graphql\queries` | `/_sitemap` | `/authScreen` | `/explore`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
