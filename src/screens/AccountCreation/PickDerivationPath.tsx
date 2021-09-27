import React, {useCallback, useState} from "react";
import {AccountCreationStackParams} from "../../types/navigation";
import {
    HdPathPicker,
    StyledSafeAreaView,
    Title,
    Subtitle,
    Divider,
    PaginatedFlatList,
    AddressListItem, Button, ItemListSeparator
} from "../../components";
import {StackScreenProps} from "@react-navigation/stack";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import {View, Text, ListRenderItemInfo} from "react-native";
import LocalWallet from "../../wallet/LocalWallet";
import {HdPath} from "../../types/hdpath";

export type Props = StackScreenProps<AccountCreationStackParams, "PickDerivationPath">;

export const PickDerivationPath: React.FC<Props> = (props) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const [selectedWallet, setSelectedWallet] = useState<LocalWallet| null>(null);
    const [selectedHdPath, setSelectedHdPath] = useState<HdPath| null>(null);

    const renderListItem = useCallback((info: ListRenderItemInfo<LocalWallet>) => {
        return <AddressListItem
            number={info.index + 1}
            address={info.item.bech32Address}
            highlight={info.item.bech32Address === selectedWallet?.bech32Address}
            onPress={() => {
                setSelectedWallet(old => {
                    return old === null ? info.item : null;
                });
                setSelectedHdPath(null)
            }}
        />
    }, [selectedWallet]);

    const listKeyExtractor = (item: LocalWallet, _: number) => {
        return item.bech32Address;
    }

    const onHdPathChange = (hdPath: HdPath) => {
        setSelectedWallet(null);
        setSelectedHdPath(hdPath);
    }

    const fetchWalletsPage: (pageIndex: number) => Promise<LocalWallet[]> = async pageIndex => {
        const itemsPerPage = 10;
        let wallets: LocalWallet [] = [];
        for (let i = 0, walletIndex = itemsPerPage * pageIndex; i < itemsPerPage; i++, walletIndex++) {
            const wallet = await generateAccount(walletIndex);
            wallets.push(wallet);
        }
        return wallets;
    }

    const generateAccount = async (index: number): Promise<LocalWallet> => {
        return LocalWallet.fromMnemonic(props.route.params.mnemonic, {
            hdPath: {
                account: 0,
                change: 0,
                addressIndex: index,
            }
        })
    }

    const onNextPressed = async () => {
        let wallet: LocalWallet;
        if (selectedHdPath !== null) {
            wallet = await LocalWallet.fromMnemonic(props.route.params.mnemonic, {
                hdPath: selectedHdPath,
            });
        } else {
            wallet = selectedWallet!;
        }
        console.log("Wallet selected: " + wallet.bech32Address);
    }

    return <StyledSafeAreaView style={styles.root}>
        <Title>
            {t("import accounts")}
        </Title>

        <Subtitle small>
            {t("please select an account or enter hd derivation path")}.
        </Subtitle>

        <Subtitle bold
            style={styles.hpPathLabel}
        >
            {t("enter HD derivation path")}.
        </Subtitle>
        <HdPathPicker style={styles.hdPathPicker} onChange={onHdPathChange}/>

        <View style={styles.dividerContainer}>
            <Divider style={styles.dividerLine}/>
            <Text style={styles.dividerText}>{t("or")}</Text>
            <Divider style={styles.dividerLine}/>
        </View>

        <Subtitle style={styles.accountLabel}>
            {t("select account you want")}
        </Subtitle>

        <PaginatedFlatList
            style={styles.addressesList}
            loadPage={fetchWalletsPage}
            renderItem={renderListItem}
            keyExtractor={listKeyExtractor}
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={ItemListSeparator}
        />

        <Button
            style={styles.nextButton}
            mode="contained"
            onPress={onNextPressed}
        >
            {t("next")}
        </Button>

    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        paddingTop: 0,
    },
    hpPathLabel: {
        marginTop: theme.spacing.l,
    },
    hdPathPicker: {
        marginTop: theme.spacing.s,
    },
    dividerContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.spacing.l
    },
    dividerLine: {
        flex: 4,
    },
    dividerText: {
        flex: 2,
        textAlign: "center",
        fontSize: 16,
        fontFamily: "SF-Pro-Text"
    },
    accountLabel: {
        marginTop: theme.spacing.l,
    },
    addressesList: {
        flex: 1,
        marginTop: theme.spacing.s,
    },
    nextButton: {
        marginTop: theme.spacing.m,
    }
}));