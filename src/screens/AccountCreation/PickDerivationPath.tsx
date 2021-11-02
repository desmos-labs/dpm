import React, {useCallback, useEffect, useState} from "react";
import {AccountCreationStackParams} from "../../types/navigation";
import {
    HdPathPicker,
    StyledSafeAreaView,
    Divider,
    PaginatedFlatList,
    AddressListItem, Button, ListItemSeparator, Typography
} from "../../components";
import {StackScreenProps} from "@react-navigation/stack";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import {View, Text, ListRenderItemInfo, TouchableOpacity} from "react-native";
import LocalWallet from "../../wallet/LocalWallet";
import {HdPath} from "../../types/hdpath";
import useAccountExists from "../../hooks/useAccountExists";
import {TopBar} from "../../components";
import {FlexPadding} from "../../components/FlexPadding";

type WalletHdPathPair = {
    wallet: LocalWallet,
    hdPath: HdPath,
}

export type Props = StackScreenProps<AccountCreationStackParams, "PickDerivationPath">;

export const PickDerivationPath: React.FC<Props> = (props) => {
    const {mnemonic} = props.route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const [selectedHdPath, setSelectedHdPath] = useState<HdPath>({
        account: 0,
        change: 0,
        addressIndex: 0,
    });
    const [selectedWallet, setSelectedWallet] = useState<LocalWallet| null>(null);
    const [addressPickerVisible, setAddressPickerVisible] = useState(false);
    const accountExists = useAccountExists();

    useEffect(() => {
        generateWalletFromHdPath(selectedHdPath);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleAddressPicker = useCallback(() => {
        setAddressPickerVisible(visible => {
            if (!visible) {
                // The address picker is is being displayed,
                // remove the wallet generated from the derivation path.
                setSelectedWallet(null);
                setSelectedHdPath({
                    account: 0,
                    change: 0,
                    addressIndex: 0,
                });
            }
            return !visible
        });
    }, []);

    const renderListItem = useCallback((info: ListRenderItemInfo<WalletHdPathPair>) => {
        const {wallet, hdPath} = info.item;
        return <AddressListItem
            number={hdPath.account}
            address={wallet.bech32Address}
            highlight={wallet.bech32Address === selectedWallet?.bech32Address}
            onPress={() => {
                setSelectedWallet(old => {
                    return old?.bech32Address === wallet.bech32Address ? null : wallet;
                });
                setSelectedHdPath(hdPath);
            }}
        />
    }, [selectedWallet]);

    const listKeyExtractor = useCallback((item: WalletHdPathPair, _: number) => {
        return item.wallet.bech32Address;
    }, []);

    const generateWalletFromHdPath = useCallback(async (hdPath: HdPath) => {
        setSelectedWallet(null);
        try {
            const wallet = await LocalWallet.fromMnemonic(mnemonic, {
                hdPath: hdPath
            });
            setSelectedWallet(wallet);
        } catch (e) {
            console.error(e);
        }
    }, [mnemonic]);

    const onHdPathChange = useCallback((hdPath: HdPath) => {
        setSelectedHdPath(hdPath);
        generateWalletFromHdPath(hdPath);
    }, [generateWalletFromHdPath]);

    const fetchWallets = useCallback(async (offset: number, limit: number) => {
        let wallets: WalletHdPathPair [] = [];
        for (let walletIndex = offset; walletIndex < limit; walletIndex++) {
            const hdPath: HdPath = {
                account: walletIndex,
                change: 0,
                addressIndex: 0,
            }
            const wallet = await LocalWallet.fromMnemonic(props.route.params.mnemonic, {
                hdPath
            })
            if (!(await accountExists(wallet.bech32Address))) {
                wallets.push({
                    wallet,
                    hdPath,
                });
            }
        }
        return wallets;
    }, [accountExists, props.route.params.mnemonic]);

    const onNextPressed = useCallback(async () => {
        if (selectedWallet !== null) {
            props.navigation.navigate({
                name: "CreateWalletPassword",
                params: {
                    wallet: selectedWallet,
                }
            })
        }
    }, [props.navigation, selectedWallet]);

    return <StyledSafeAreaView
        style={styles.root}
        topBar={<TopBar stackProps={props} />}
    >
        <Typography.Title>
            {t("import accounts")}
        </Typography.Title>

        <Typography.Body>
            {t("please select an account or enter hd derivation path")}.
        </Typography.Body>

        <Typography.Subtitle
            style={[
                styles.hpPathLabel,
                addressPickerVisible ? styles.disabledText : null
            ]}
        >
            {t("enter HD derivation path")}.
        </Typography.Subtitle>
        <HdPathPicker
            style={styles.hdPathPicker}
            onChange={onHdPathChange}
            value={selectedHdPath}
            disabled={addressPickerVisible}
        />

        {!addressPickerVisible && (
            <Typography.Body style={styles.addressText}>
                {selectedWallet ?
                    selectedWallet.bech32Address :
                    `${t("generating address")}...`}
            </Typography.Body>
        )}

        <View style={styles.dividerContainer}>
            <Divider style={styles.dividerLine}/>
            <Text style={styles.dividerText}>{t("or")}</Text>
            <Divider style={styles.dividerLine}/>
        </View>

        <TouchableOpacity
            onPress={toggleAddressPicker}
        >
            <Typography.Subtitle style={[
                styles.accountLabel,
                !addressPickerVisible ? styles.accentText : null,
            ]}>
                {t("select account you want")}
            </Typography.Subtitle>
        </TouchableOpacity>

        {addressPickerVisible ? (
            <PaginatedFlatList
                style={styles.addressesList}
                loadPage={fetchWallets}
                itemsPerPage={20}
                renderItem={renderListItem}
                keyExtractor={listKeyExtractor}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={ListItemSeparator}
            />
        ) : (
            <FlexPadding flex={1}/>
        )}
        <Button
            style={styles.nextButton}
            mode="contained"
            onPress={onNextPressed}
            disabled={selectedWallet === null}
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
    addressText: {
        marginTop: theme.spacing.m,
    },
    dividerContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.spacing.s
    },
    dividerLine: {
        flex: 4,
    },
    dividerText: {
        flex: 2,
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Poppins-Regular"
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
    },
    disabledText: {
        color: theme.colors.disabled,
    },
    accentText: {
        color: theme.colors.font["4"],
    }
}));