import "dotenv/config";
import appJson from "./app.json";

export default ({ config }) => ({
  ...config,
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,

    isDev: process.env.EXPO_PUBLIC_IS_DEV === "true",
    localIp: process.env.EXPO_PUBLIC_IP_ADDRESS,

    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API,

    // Firebase Config
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,

    // Google Auth Config
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET,

    // Google Service Plist Config
    clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
    reversedClientId: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    gcmSenderId: process.env.EXPO_PUBLIC_GCM_SENDER_ID,
    plistVersion: process.env.EXPO_PUBLIC_PLIST_VERSION,
    bundleId: process.env.EXPO_PUBLIC_BUNDLE_ID,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    isAdsEnabled: process.env.EXPO_PUBLIC_IS_ADS_ENABLED === "true",
    isAnalyticsEnabled: process.env.EXPO_PUBLIC_IS_ANALYTICS_ENABLED === "true",
    isAppInviteEnabled: process.env.EXPO_PUBLIC_IS_APPINVITE_ENABLED === "true",
    isGcmEnabled: process.env.EXPO_PUBLIC_IS_GCM_ENABLED === "true",
    isSignInEnabled: process.env.EXPO_PUBLIC_IS_SIGNIN_ENABLED === "true",
    googleAppId: process.env.EXPO_PUBLIC_GOOGLE_APP_ID,
    databaseUrl: process.env.EXPO_PUBLIC_DATABASE_URL,
  },
  ios: {
    ...appJson.expo.ios,
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST || "./GoogleService-Info.plist",
  },
  android: {
    ...appJson.expo.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICE_JSON || "./google-services.json",
  },
  plugins: [
    ...appJson.expo.plugins,
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.282407202899-qum38oc4b66oe3b2lg3jpvo3r1d8hidb",
      },
    ],
    // [
    //   "expo-font",
    //   {
    //     fonts: {
    //       Comfortaa: "./assets/fonts/Comfortaa-VariableFont_wght.ttf",
    //     },
    //   },
    // ],
  ],
});
