const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias['react-native'] = 'react-native-web';
  config.resolve.alias['react-native-maps'] = 'react-native-web-maps';

  //config.resolve.alias['react-native-web/dist/exports/WebView'] = 'react-native-web/dist/index.js';
  config.resolve.alias['react-native-keyboard-aware-scroll-view'] = 'react-native-web';

  return config;
};