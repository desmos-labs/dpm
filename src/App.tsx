import React from 'react';
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";
import {DesmosSdkProvider} from "@desmoslabs/sdk-react";
import {AppStateProvider} from "./contexts/AppContext";
import {WalletContextProvider} from "./contexts/WalletConnectContext";
import {ApolloProvider} from "@apollo/client";
import useApolloClient from "./graphql/hooks/useApolloClient";
import {StatusBar} from "react-native";
import {DesmosIcon} from "./components";
import {Settings} from "react-native-paper/lib/typescript/core/settings";
import {RootStackScreens} from "./navigation/RootStackScreens";

const PaperProviderSettings: Settings = {
    icon: props => <DesmosIcon {...props} />
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
                            <RootStackScreens />
                        </PaperProvider>
                    </WalletContextProvider>
                </AppStateProvider>
            </DesmosSdkProvider>
        </ApolloProvider>
    );
}
