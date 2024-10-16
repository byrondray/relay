export default ({ config }) => {
  return {
    ...config,
    ios: {
      ...config.ios,
      googleServicesFile:
        process.env.GOOGLE_SERVICE_INFO_PLIST || './GoogleService-Info.plist',
    },
  };
};
