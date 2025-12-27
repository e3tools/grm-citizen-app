// Jest setup file
// Note: jest-expo handles most Expo mocks automatically
// Only add custom mocks here if needed

// Extend Jest matchers for React Native
try {
  require('@testing-library/jest-native/extend-expect')
} catch (e) {
  // Ignore if not available
}

// Mock EventEmitter (needed by @expo/vector-icons and react-native-paper)
jest.mock('react-native/Libraries/vendor/emitter/EventEmitter', () => {
  return jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
  }))
})

// Mock NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  return jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    removeSubscription: jest.fn(),
  }))
})

// Mock @expo/vector-icons to avoid EventEmitter issues
jest.mock('@expo/vector-icons', () => {
  const React = require('react')
  const {Text} = require('react-native')
  const IconComponent = ({name, ...props}) =>
    React.createElement(Text, {...props}, name)
  return {
    Feather: IconComponent,
    MaterialIcons: IconComponent,
    Ionicons: IconComponent,
    MaterialCommunityIcons: IconComponent,
    AntDesign: IconComponent,
    Entypo: IconComponent,
    FontAwesome: IconComponent,
    FontAwesome5: IconComponent,
    Fontisto: IconComponent,
    Foundation: IconComponent,
    Octicons: IconComponent,
    Zocial: IconComponent,
    SimpleLineIcons: IconComponent,
  }
})

// Mock SVG imports
jest.mock('react-native-svg', () => {
  const React = require('react')
  const {View} = require('react-native')
  return {
    Svg: ({children, ...props}) =>
      React.createElement(View, {...props}, children),
    Path: props => React.createElement(View, props),
    Circle: props => React.createElement(View, props),
    G: ({children, ...props}) =>
      React.createElement(View, {...props}, children),
  }
})

// Mock SVG files
jest.mock('react-native-svg-transformer', () => ({
  default: 'SvgMock',
}))

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react')
  const RN = require('react-native')

  // Provider must be a proper React component class/function
  function Provider({children, ...props}) {
    return React.createElement(React.Fragment, {}, children)
  }

  return {
    Provider,
    TextInput: RN.TextInput,
    ActivityIndicator: ({...props}) =>
      React.createElement(RN.View, {...props, testID: 'activity-indicator'}),
    Button: ({children, onPress, ...props}) =>
      React.createElement(
        RN.TouchableOpacity,
        {...props, onPress, testID: 'paper-button'},
        children,
      ),
    Modal: RN.Modal,
  }
})

// Mock react-native-confirmation-code-field
jest.mock('react-native-confirmation-code-field', () => ({
  useBlurOnFulfill: jest.fn(() => ({current: null})),
  useClearByFocusCell: jest.fn(() => [{}, jest.fn()]), // Returns [props, handler] as array
  CodeField: ({...props}) => {
    const React = require('react')
    const {View} = require('react-native')
    return React.createElement(View, {...props, testID: 'code-field'})
  },
}))

// Mock expo-secure-store (needed by storageManager)
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}))

// Global test utilities
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: async () => ({}),
      ok: true,
      status: 200,
    }),
  )
}
