module.exports = {
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-native'],
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  env: {
    node: true,
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prettier/prettier': 0,
    'no-console': 1,
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'global-require': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react/function-component-definition': 0,
    'react/no-unstable-nested-components': 1,
    'react/require-default-props': 0,
  },
};
