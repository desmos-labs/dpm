import React, {useEffect, useRef} from 'react';
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";
import {SplashScreen} from "./screens/SplashScreen";
import {DesmosSdkProvider} from "@desmoslabs/sdk-react";
import {NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {RootStack, RootStackParams} from "./types/navigation";
import AccountCreationScreens from "./navigation/AccountCreationScreens";
import AccountScreens from "./navigation/AccountScreens";
import useInitAppState from "./hooks/useInitAppState";
import {ModalScreen} from "./modals/ModalScreen";
import {AppStateProvider, useAppContext} from "./contexts/AppContext";
import {useWalletConnectContext, WalletContextProvider} from "./contexts/WalletConnectContext";
import {ApolloProvider} from "@apollo/client";
import useApolloClient from "./graphql/hooks/useApolloClient";
import {StatusBar} from "react-native";
import {DesmosIcon} from "./components";
import {Settings} from "react-native-paper/lib/typescript/core/settings";

const PaperProviderSettings: Settings = {
    icon: props => <DesmosIcon {...props} />
}

function AppContent(): JSX.Element {
    const appState = useInitAppState();
    const {accounts, selectedAccount} = useAppContext();
    const {initWalletConnect, initState} = useWalletConnectContext();
    const navigatorRef = useRef<NavigationContainerRef<RootStackParams>>(null);

    useEffect(() => {
        if (!initState.initializing && initState.error) {
            console.error("Error initializing WalletConnect", initState.error);
        }
    }, [initState]);

    useEffect(() => {
        initWalletConnect()
    }, [initWalletConnect])

    // Navigate to the correct screen after loading all the data.
    useEffect(() => {
        if (!appState.initializing && navigatorRef.current !== null) {
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
                const homeRoutes = ["Home", "Authorization"];
                if (route?.name === undefined || homeRoutes.indexOf(route?.name) === -1) {
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
    }, [appState.initializing, navigatorRef, selectedAccount])


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
    const client = useApolloClient();

    //const chainId = __DEV__ ? 'morpheus-apollo-2' : 'desmos-mainnet'
    // Force to testnet for the moment
    const chainId = 'morpheus-apollo-2';
    return (
        <ApolloProvider client={client}>
            <DesmosSdkProvider chainId={chainId}>
                <AppStateProvider>
                    <WalletContextProvider>
                        <PaperProvider
                            theme={AppTheme}
                            settings={PaperProviderSettings}
                        >
                            <StatusBar
                                translucent
                                backgroundColor="transparent"
                                barStyle={"dark-content"}
                            />
                            <AppContent />
                        </PaperProvider>
                    </WalletContextProvider>
                </AppStateProvider>
            </DesmosSdkProvider>
        </ApolloProvider>
    );
}
