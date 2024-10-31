/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/Carpool/createRide` | `/(tabs)/Carpool/postRequest` | `/(tabs)/Community/community` | `/(tabs)/settings` | `/(tabs)/temp` | `/..\components\carpool\carFeaturesCheckbox` | `/..\components\carpool\carpoolDescription` | `/..\components\carpool\carpoolFrequency` | `/..\components\carpool\carpoolPickerBar` | `/..\components\carpool\dateAndTimePicker` | `/..\components\carpool\mapAiInfo` | `/..\components\carpool\paymentInfo` | `/..\components\carpool\rideMap` | `/..\components\carpool\vehicleDetails` | `/..\hooks\carpoolCreateState` | `/..\hooks\carpoolRequestState` | `/..\utils\calculateMiddleOfRoute` | `/Carpool/createRide` | `/Carpool/postRequest` | `/Community/community` | `/Login/login` | `/OnboardForms/child` | `/OnboardForms/parent` | `/OnboardForms/vehicle` | `/Register/register` | `/_sitemap` | `/settings` | `/temp` | `/theme`;
      DynamicRoutes: `/(tabs)/messages/${Router.SingleRoutePart<T>}` | `/messages/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/messages/[userId]` | `/messages/[userId]`;
    }
  }
}
