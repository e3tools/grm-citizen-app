module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'prettier',
    'prettier/react',
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
