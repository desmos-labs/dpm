import React from 'react';
import {SafeAreaView, StatusBar, Text} from 'react-native';
import {RecoilRoot} from "recoil";
import Colors from "./constants/colors";
import Navigator from "./navigation";
import useWalletConnectInit from "./hooks/useWalletConnectInit";

function AppContent(): JSX.Element {
    const walletConnect = useWalletConnectInit();

    if (!walletConnect.initialized) {
        return <SafeAreaView>
            <Text>Loading...</Text>
        </SafeAreaView>
    }
    else {
        return <Navigator/>;
    }
}

export default function App(): JSX.Element {
    return <RecoilRoot>
        <StatusBar hidden={false} backgroundColor={Colors.DesmosOrange} />
        <AppContent/>
    </RecoilRoot>;
}
