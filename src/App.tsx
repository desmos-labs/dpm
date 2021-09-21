import React from 'react';
import {StatusBar} from 'react-native';
import {RecoilRoot} from 'recoil';
import Colors from './constants/colors';
import Navigator from './navigation';
import useWalletConnectInit from './hooks/useWalletConnectInit';
import useLoadAccounts from './hooks/useLoadAccounts';
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";
import {useInitI18n} from "./i18n/i18n";
import {SplashScreen} from "./screens/SplashScreen";

function AppContent(): JSX.Element {
    const walletConnect = useWalletConnectInit();
    const accountLoadStatus = useLoadAccounts();
    const i18nState = useInitI18n();

    if (walletConnect.isPending() ||
        accountLoadStatus.isPending() ||
        i18nState.isPending()) {
        return <SplashScreen />;
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
