module.exports = {
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'airbnb',
		'airbnb-typescript',
		'airbnb-typescript-prettier',
		'prettier',
	],
	env: {
		amd: true,
		node: true,
		browser: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	rules: {
		'prettier/prettier': ['error'],
		'no-use-before-define': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'react/function-component-definition': 0,
		'@typescript-eslint/no-var-requires': 0,
		'react/no-unstable-nested-components': 1,
		'global-require': 0,
	},
};
