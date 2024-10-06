/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/explore` | `/(tabs)/sandbox/sandbox` | `/(tabs)\sandbox\card` | `/Login/login` | `/Register/register` | `/_sitemap` | `/explore` | `/sandbox/sandbox`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
