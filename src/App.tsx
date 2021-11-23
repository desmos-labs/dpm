import React from 'react';
import {DesmosSdkProvider} from "@desmoslabs/sdk-react";
import {AppStateProvider} from "./contexts/AppContext";
import {WalletContextProvider} from "./contexts/WalletConnectContext";
import {ApolloProvider} from "@apollo/client";
import useApolloClient from "./graphql/hooks/useApolloClient";
import {StatusBar} from "react-native";
import {RootStackScreens} from "./navigation/RootStackScreens";
import {ThemeProvider} from "./contexts/ThemeContext";


export default function App(): JSX.Element {
    const chainId = __DEV__ ? 'morpheus-apollo-2' : 'desmos-mainnet';
    //const chainId = 'morpheus-apollo-2';
    const client = useApolloClient(chainId);

    return (
        <ApolloProvider client={client}>
            <DesmosSdkProvider chainId={chainId}>
                <AppStateProvider>
                    <WalletContextProvider>
                        <ThemeProvider>
                            <StatusBar
                                translucent
                                backgroundColor="transparent"
                                barStyle={"dark-content"}
                            />
                            <RootStackScreens />
                        </ThemeProvider>
                    </WalletContextProvider>
                </AppStateProvider>
            </DesmosSdkProvider>
        </ApolloProvider>
    );
}
