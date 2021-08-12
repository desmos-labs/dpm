import React from 'react';
import {SafeAreaView, StatusBar, Text} from 'react-native';
import {RecoilRoot} from 'recoil';
import Colors from './constants/colors';
import Navigator from './navigation';
import useWalletConnectInit from './hooks/useWalletConnectInit';
import useLoadAccounts from './hooks/useLoadAccounts';

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
            <StatusBar hidden={false} backgroundColor={Colors.DesmosOrange} />
            <AppContent />
        </RecoilRoot>
    );
}
