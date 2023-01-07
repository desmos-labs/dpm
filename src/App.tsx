import React from 'react';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';
import { AppStateProvider } from 'contexts/AppContext';
import { WalletContextProvider } from 'contexts/WalletConnectContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeContext';

const App = () => (
  <RecoilRoot>
    <AppStateProvider>
      <WalletContextProvider>
        <ThemeProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </WalletContextProvider>
    </AppStateProvider>
  </RecoilRoot>
);

export default App;
