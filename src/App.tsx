import React from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeProvider';
import GraphQLClientProvider from 'contexts/GraphQLClientProvider';
import { StatusBar } from 'react-native';
import useLockApplicationOnBlur from 'hooks/useLockApplicationOnBlur';
import RNBootSplash from 'react-native-bootsplash';

const AppLockLogic = () => {
  useLockApplicationOnBlur();
  return <></>;
};

const Navigation = () => (
  <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}>
    <AppLockLogic />
    <RootNavigator />
  </NavigationContainer>
);

const App = () => (
  <RecoilRoot>
    <GraphQLClientProvider>
      <ThemeProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Navigation />
      </ThemeProvider>
    </GraphQLClientProvider>
  </RecoilRoot>
);

export default App;
