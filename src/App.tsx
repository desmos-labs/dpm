import React, {useEffect, useRef} from 'react';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";
import {SplashScreen} from "./screens/SplashScreen";
import {DesmosSdkProvider} from "@desmoslabs/sdk-react";
import ChainStore from "./store/ChainStore";
import {NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {RootStack, RootStackParams} from "./types/navigation";
import WalletConnectStore from "./store/WalletConnectStore";
import AccountCreationScreens from "./navigation/AccountCreationScreens";
import AccountScreens from "./navigation/AccountScreens";
import useInitAppState from "./hooks/useInitAppState";
import {ModalScreen} from "./modals/ModalScreen";

function AppContent(): JSX.Element {
    const appState = useInitAppState();
    const accounts = useRecoilValue(ChainStore.chainAccounts);
    const navigatorRef = useRef<NavigationContainerRef<RootStackParams>>(null);
    const requests = useRecoilValue(WalletConnectStore.sessionRequests);
    const selectedAccount = useRecoilValue(ChainStore.selectedAccount);

    const loading = appState.initializing;

    useEffect(() => {
        // if (navigatorRef.current !== null && requests.length > 0) {
        //     navigatorRef.current.navigate({
        //         name: "WalletConnectRequest",
        //         params: {
        //             session: requests[0].session,
        //             request: requests[0].request,
        //         },
        //         key: requests[0].request.request.id.toString()
        //     });
        // }
    }, [requests]);

    // Navigate to the correct screen after loading all the data.
    useEffect(() => {
        if (!loading && navigatorRef.current !== null) {
            if (accounts.length === 0 || selectedAccount === null) {
                // No account, go to the create account screens
                navigatorRef.current.reset({
                    index: 0,
                    routes: [{name: "AccountCreationScreens"}],
                })
            }
            else {
                const route = navigatorRef.current.getCurrentRoute();
                const state = navigatorRef.current.getState();
                if (route?.name !== "Profile") {
                    const key = state?.routes.find(r => r.name === "AccountScreens")?.key;
                    navigatorRef.current.reset({
                        index: 0,
                        routes: [{
                            name: "AccountScreens",
                            key
                        }],
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, navigatorRef, selectedAccount])


    return <NavigationContainer ref={navigatorRef}>
        <RootStack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
            <RootStack.Screen name="AccountScreens" component={AccountScreens}/>
            <RootStack.Screen name="AccountCreationScreens" component={AccountCreationScreens}/>
            <RootStack.Screen name="ModalScreen" component={ModalScreen}
                options={{
                    presentation: "transparentModal"
                }}
            />
        </RootStack.Navigator>
    </NavigationContainer>;
}

export default function App(): JSX.Element {
    const chainId = __DEV__ ? 'morpheus-apollo-2' : 'desmos-mainnet'
    return (
        <DesmosSdkProvider chainId={chainId}>
            <RecoilRoot>
                <PaperProvider theme={AppTheme}>
                    <AppContent />
                </PaperProvider>
            </RecoilRoot>
        </DesmosSdkProvider>
    );
}
