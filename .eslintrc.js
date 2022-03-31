module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-native'],
  env: {
    es6: true,
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
    // Avoiding prettier errors
    'prettier/prettier': 0,
    // Permitting console.logs/warns
    'no-console': 0,
    // Permitting to define functions wherever you want
    'no-use-before-define': 0,
    // Permitting to use the '_' (safely)
    'no-underscore-dangle': 0,
    // Avoiding refactoring every image request, is fine to use (written also in the react-native doc)
    'global-require': 0,
    // Strange behavior with default imports
    'import/no-named-as-default': 0,
    // Typescript related warnings
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': 0,
    // React related warnings
    'react/function-component-definition': 0,
    'react/no-unstable-nested-components': 1,
    'react/no-unused-prop-types': 0,
    // Sometimes is heavier to pass every single prop, especially when there are inherited props from default components
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
  },
};
