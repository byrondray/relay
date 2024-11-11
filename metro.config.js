const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    blacklistRE: exclusionList([
      /node_modules\/.*\/node_modules\/react-native\/.*/, // Avoid nested node_modules/react-native (common cause of excessive watchers)
      /node_modules\/.*\/node_modules\/react-native-svg\/.*/, // Ignore react-native-svg within nested node_modules
      /node_modules\/.*\/.bin\/.*/, // Exclude binaries
    ]),
  };

  return config;
})();
