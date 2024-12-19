const reactNativeJestPreset = require('react-native/jest-preset')

module.exports = {
  preset: 'react-native',
  // Override default platform to android
  haste: {
    ...reactNativeJestPreset.haste,
    defaultPlatform: 'android',
  },
}