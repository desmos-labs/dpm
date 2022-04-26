import React from 'react';
import { StatusBar } from 'react-native';
import { AppStateProvider } from './contexts/AppContext';
import ThemeProvider from './contexts/ThemeContext';
import { WalletContextProvider } from './contexts/WalletConnectContext';
import RootStackScreens from './navigation/RootStackScreens';

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
