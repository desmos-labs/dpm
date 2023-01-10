import React from 'react';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeContext';

const App = () => (
  <RecoilRoot>
    <ThemeProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ThemeProvider>
  </RecoilRoot>
);

export default App;
