import React from 'react';
import {SafeAreaView, StatusBar, Text} from 'react-native';
import {RecoilRoot} from 'recoil';
import Colors from './constants/colors';
import Navigator from './navigation';
import useWalletConnectInit from './hooks/useWalletConnectInit';
import useLoadAccounts from './hooks/useLoadAccounts';
import "./i18n/i18n";
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";

function AppContent(): JSX.Element {
    const walletConnect = useWalletConnectInit();
    const accountLoadStatus = useLoadAccounts();

    if (walletConnect.isPending() || accountLoadStatus.isPending()) {
        return (
            <SafeAreaView>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    } else {
        return <Navigator />;
    }
}

export default function App(): JSX.Element {
    return (
        <RecoilRoot>
            <PaperProvider theme={AppTheme}>
                <StatusBar hidden={false} backgroundColor={Colors.DesmosOrange} />
                <AppContent />
            </PaperProvider>
        </RecoilRoot>
    );
}
