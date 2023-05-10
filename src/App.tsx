import React from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeProvider';
import GraphQLClientProvider from 'contexts/GraphQLClientProvider';
import { StatusBar } from 'react-native';
import useLockApplicationOnBlur from 'hooks/useLockApplicationOnBlur';
import RNBootSplash from 'react-native-bootsplash';
import SnackBarProvider from 'lib/SnackBarProvider';
import DesmosPostHogProvider from 'components/DesmosPostHogProvider';

const AppLockLogic = () => {
  useLockApplicationOnBlur();
  return <></>;
};

const Navigation = () => (
  <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}>
    <AppLockLogic />
    <DesmosPostHogProvider>
      <RootNavigator />
    </DesmosPostHogProvider>
  </NavigationContainer>
);

const App = () => (
  <RecoilRoot>
    <GraphQLClientProvider>
      <ThemeProvider>
        <SnackBarProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <Navigation />
        </SnackBarProvider>
      </ThemeProvider>
    </GraphQLClientProvider>
  </RecoilRoot>
);

export default App;
