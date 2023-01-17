import React from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import RootNavigator, { RootNavigatorParamList } from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeProvider';
import GraphQLClientProvider from 'contexts/GraphQLClientProvider';
import { StatusBar } from 'react-native';

const Navigation = () => {
  const navigationRef = React.createRef<NavigationContainerRef<RootNavigatorParamList>>();
  // useLockApplicationOnBlur(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  );
};

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
