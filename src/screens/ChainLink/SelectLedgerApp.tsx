import React, {useCallback} from "react";
import {CompositeScreenProps} from "@react-navigation/native";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams, RootStackParams} from "../../types/navigation";
import {BlockchainListItem, ListItemSeparator, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {FlatList, ListRenderItemInfo} from "react-native";
import {LedgerApp} from "../../types/ledger";
import {makeStyle} from "../../theming";


export type Props = CompositeScreenProps<
    StackScreenProps<ChainLinkScreensStackParams, "SelectLedgerApp">,
    StackScreenProps<RootStackParams>>;

export const SelectLedgerApp: React.FC<Props> = ({navigation, route}) => {
    const {chain, ledgerApplications, backAction} = route.params
    const {t} = useTranslation();
    const styles = useStyles();

    const renderLedgerApp = useCallback(({item}: ListRenderItemInfo<LedgerApp>) => {
        return <BlockchainListItem
            onPress={() => {
                navigation.navigate({
                    key: "ledger",
                    name: "ScanForLedger",
                    params: {
                        chain,
                        backAction,
                        ledgerApp: item,
                    }
                })
            }}
            name={item.uiName}
            icon={item.icon}
        />
    }, [backAction, chain, navigation]);

    return <StyledSafeAreaView
        style={styles.background}
        topBar={<TopBar
            style={styles.background}
            stackProps={{navigation}}
            title={t("Select app")}
        />}>

        <Typography.Body>
            {t("Select the App you would like to connect")}
        </Typography.Body>

        <FlatList
            style={styles.appList}
            data={ledgerApplications}
            renderItem={renderLedgerApp}
            ItemSeparatorComponent={ListItemSeparator}
            keyExtractor={((item, index) => index.toString())}
        />

    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    background: {
        backgroundColor: theme.colors.background2
    },
    appList: {
        marginTop: theme.spacing.m,
    }
}))