module.exports = {
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  env: {
    amd: true,
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'prettier/prettier': 0,
    'no-use-before-define': 0,
    'global-require': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    'react/function-component-definition': 0,
    'react/no-unstable-nested-components': 1,
    'react/require-default-props': 0,
  },
};
