import React from 'react';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeProvider';
import GraphQLClientProvider from 'contexts/GraphQLClientProvider';

const App = () => (
  <RecoilRoot>
    <GraphQLClientProvider>
      <ThemeProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GraphQLClientProvider>
  </RecoilRoot>
);

export default App;
