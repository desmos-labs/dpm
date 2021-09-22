import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {RecoilRoot, useRecoilValue} from 'recoil';
import Colors from './constants/colors';
import useWalletConnectInit from './hooks/useWalletConnectInit';
import useLoadAccounts from './hooks/useLoadAccounts';
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";
import {useInitI18n} from "./i18n/i18n";
import {SplashScreen} from "./screens/SplashScreen";
import {DesmosSdkProvider} from "@desmoslabs/sdk-react";
import AccountStore from "./store/AccountStore";
import {NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {AccountScreensStackParams, RootStack} from "./types/navigation";
import WalletConnectStore from "./store/WalletConnectStore";
import AccountCreationScreens from "./navigation/AccountCreationScreens";
import AccountScreens from "./navigation/AccountScreens";
import SelectAccount from "./screens/Accounts";

function AppContent(): JSX.Element {
    const walletConnect = useWalletConnectInit();
    const accountLoadStatus = useLoadAccounts();
    const i18nState = useInitI18n();
    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const navigatorRef = useRef<NavigationContainerRef<AccountScreensStackParams>>(null);
    const requests = useRecoilValue(WalletConnectStore.sessionRequests);
    const selectedAccount = useRecoilValue(AccountStore.selectedAccount);

    const loading = walletConnect.isPending() ||
        accountLoadStatus.isPending() || i18nState.isPending();

    useEffect(() => {
        if (navigatorRef.current !== null && requests.length > 0) {
            navigatorRef.current.navigate({
                name: "WalletConnectRequest",
                params: {
                    session: requests[0].session,
                    request: requests[0].request,
                },
                key: requests[0].request.request.id.toString()
            });
        }
    }, [requests])

    return <NavigationContainer ref={navigatorRef}>
        <RootStack.Navigator
            screenOptions={{
                animationEnabled: false,
                headerShown: false,
            }}
        >
            {loading ? (
                <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
            ) : accounts.length === 0 ? (
                <RootStack.Screen name="AccountCreationScreens" component={AccountCreationScreens}/>
            ) : selectedAccount !== null ? (
                <RootStack.Screen name="AccountScreens" component={AccountScreens}/>
            ) : (
                <RootStack.Screen name="SelectAccount" component={SelectAccount}/>
            )}
        </RootStack.Navigator>
    </NavigationContainer>;
}

export default function App(): JSX.Element {
    const chainId = __DEV__ ? 'morpheus-apollo-2' : 'desmos-mainnet'
    return (
        <DesmosSdkProvider chainId={chainId}>
            <RecoilRoot>
                <PaperProvider theme={AppTheme}>
                    <StatusBar hidden={false} backgroundColor={Colors.DesmosOrange} />
                    <AppContent />
                </PaperProvider>
            </RecoilRoot>
        </DesmosSdkProvider>
    );
}
