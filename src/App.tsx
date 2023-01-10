import React from 'react';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';
import { AppStateProvider } from 'contexts/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeContext';

const App = () => (
  <RecoilRoot>
    <AppStateProvider>
      <ThemeProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AppStateProvider>
  </RecoilRoot>
);

export default App;
