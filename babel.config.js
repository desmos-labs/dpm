module.exports = {
  env: {
    production: {
      plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
    },
  },
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          assets: './src/assets',
          components: './src/components',
          config: './src/config',
          constants: './src/constants',
          contexts: './src/contexts',
          hooks: './src/hooks',
          lib: './src/lib',
          modals: './src/modals',
          native: './src/native',
          navigation: './src/navigation',
          '@recoil': './src/recoil',
          screens: './src/screens',
          services: './src/services',
          sources: './src/sources',
          types: './src/types',
          walletconnect: './src/walletconnect',
        },
      },
    ],
  ],
};
