import React from 'react';
import { StatusBar } from 'react-native';
import RootStackScreens from 'navigation/RootStackScreens';
import { AppStateProvider } from './contexts/AppContext';
import ThemeProvider from './contexts/ThemeContext';
import { WalletContextProvider } from './contexts/WalletConnectContext';

export default function App(): JSX.Element {
  return (
        <AppStateProvider>
          <WalletContextProvider>
            <ThemeProvider>
              <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
              <RootStackScreens />
            </ThemeProvider>
          </WalletContextProvider>
        </AppStateProvider>
  );
}
