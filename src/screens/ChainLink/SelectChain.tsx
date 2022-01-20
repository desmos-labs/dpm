import React, {useCallback} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams, ImportMode} from "../../types/navigation";
import {BlockchainListItem, ListItemSeparator, StyledSafeAreaView, TopBar} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {FlatList, ListRenderItemInfo} from "react-native";
import {LinkableChain, LinkableChains} from "../../types/chain";
import {CosmosLedgerApp, CryptoOrgLedgerApp, LedgerApp, TerraLedgerApp} from "../../types/ledger";

export type Props = StackScreenProps<ChainLinkScreensStackParams, "SelectChain">

function getLedgerApplicationForChain(chain: LinkableChain): LedgerApp[] {
    if (chain.chainConfig.name === "terra") {
        return [TerraLedgerApp]
    } else if (chain.chainConfig.name === "crypto.org") {
        return [CryptoOrgLedgerApp]
    } else {
        return [CosmosLedgerApp]
    }
}

export const SelectChain: React.FC<Props> = ({navigation, route}) => {
    const {importMode, feeGranter, backAction} = route.params
    const {t} = useTranslation();
    const styles = useStyle();

    const linkChain = useCallback((chain: LinkableChain) => {
        if (importMode === ImportMode.Mnemonic) {
            navigation.navigate({
                name: "LinkWithMnemonic",
                params: {
                    importMode,
                    chain,
                    feeGranter,
                    backAction
                }
            })
        } else {
            navigation.navigate({
                name: "SelectLedgerApp",
                params: {
                    chain,
                    ledgerApplications: getLedgerApplicationForChain(chain),
                    backAction,
                }
            })
        }
    }, [navigation, importMode, feeGranter, backAction])

    const renderListItem = useCallback(({item}: ListRenderItemInfo<LinkableChain>) => {
        return <BlockchainListItem
            name={item.name}
            icon={item.icon}
            onPress={() => linkChain(item)}
        />
    }, [linkChain]);

    return <StyledSafeAreaView
        style={styles.background}
        topBar={<TopBar
            style={styles.background}
            stackProps={{navigation}}
            title={t("select chain")}
        />}
    >
        <FlatList
            style={styles.list}
            data={LinkableChains}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ListItemSeparator}
        />
    </StyledSafeAreaView>
}

const useStyle = makeStyle(theme => ({
    background: {
        backgroundColor: theme.colors.background2
    },
    list: {
        flex: 1,
    },
    topMargin: {
        marginTop: theme.spacing.l
    },
}));