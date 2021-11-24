import React, {useCallback, useEffect, useState} from "react";
import {
    AccountScreensStackParams,
    ChainLinkScreensStackParams,
    ImportMode,
} from "../../types/navigation";
import {
    AddressListItem,
    Button,
    Divider,
    HdPathPicker,
    ListItemSeparator,
    PaginatedFlatList,
    StyledSafeAreaView,
    TopBar,
    Typography
} from "../../components";
import {StackScreenProps} from "@react-navigation/stack";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import {ListRenderItemInfo, TouchableOpacity, View} from "react-native";
import LocalWallet from "../../wallet/LocalWallet";
import {HdPath} from "../../types/hdpath";
import {FlexPadding} from "../../components/FlexPadding";
import useGenerateProof from "../../hooks/useGenerateProof";
import {MsgLinkChainAccountEncodeObject} from "@desmoslabs/sdk-core";
import {MsgLinkChainAccount} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_chain_links";
import useSelectedAccount from "../../hooks/useSelectedAccount";
import {CompositeScreenProps} from "@react-navigation/native";
import {computeTxFees, messagesGas} from "../../types/fees";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import useAddChinLink from "../../hooks/useAddChainLink";

type WalletHdPathPair = {
    wallet: LocalWallet,
    hdPath: HdPath,
}

export type Props = CompositeScreenProps<
    StackScreenProps<ChainLinkScreensStackParams, "PickAddress">,
    StackScreenProps<AccountScreensStackParams>>


export const PickAddress: React.FC<Props> = (props) => {
    const {navigation} = props;
    const {mnemonic, importMode, chain, feeGranter, backAction} = props.route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const [selectedHdPath, setSelectedHdPath] = useState<HdPath>(chain.hdPath);
    const [selectedWallet, setSelectedWallet] = useState<LocalWallet| null>(null);
    const [addressPickerVisible, setAddressPickerVisible] = useState(false);
    const chainInfo = useCurrentChainInfo();
    const selectedAccount = useSelectedAccount();
    const generateProof = useGenerateProof();
    const addChainLink = useAddChinLink(selectedAccount.address);

    const generateWalletFromHdPath = useCallback(async (hdPath: HdPath) => {
        setSelectedWallet(null);
        try {
            if (importMode === ImportMode.Mnemonic) {
                const wallet = await LocalWallet.fromMnemonic(mnemonic!, {
                    hdPath: hdPath,
                    prefix: chain.prefix,
                });
                setSelectedWallet(wallet);
            }
        } catch (e) {
            console.error(e);
        }
    }, [mnemonic, importMode, chain]);

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
                setSelectedHdPath(chain.hdPath);
            } else {
                if (selectedWallet === null) {
                    setSelectedHdPath(chain.hdPath);
                    generateWalletFromHdPath(chain.hdPath);
                }
            }
            return !visible
        });
    }, [chain, generateWalletFromHdPath, selectedWallet]);

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

    const onHdPathChange = useCallback((hdPath: HdPath) => {
        setSelectedHdPath(hdPath);
        generateWalletFromHdPath(hdPath);
    }, [generateWalletFromHdPath]);

    const fetchWallets = useCallback(async (offset: number, limit: number) => {
        let wallets: WalletHdPathPair [] = [];
        for (let walletIndex = offset; walletIndex < limit; walletIndex++) {
            const hdPath: HdPath = {
                ...chain.hdPath,
                account: walletIndex,
            }
            const wallet = await LocalWallet.fromMnemonic(mnemonic!, {
                hdPath,
                prefix: chain.prefix
            })
            wallets.push({wallet, hdPath});
        }
        return wallets;
    }, [mnemonic, chain]);

    const onNextPressed = useCallback(async () => {
        if (selectedWallet !== null) {
            const proof = await generateProof({
                externalChainWallet: selectedWallet,
                chain
            });
            const msg: MsgLinkChainAccountEncodeObject = {
                typeUrl: "/desmos.profiles.v1beta1.MsgLinkChainAccount",
                value: MsgLinkChainAccount.fromPartial({
                    signer: selectedAccount.address,
                    proof: proof.proof,
                    chainConfig: proof.chainConfig,
                    chainAddress: proof.chainAddress,
                })
            }
            const messages = [msg];
            const gas = messagesGas(messages);
            const fee = computeTxFees(gas, chainInfo.coinDenom).average
            navigation.navigate({
                name: "ConfirmTx",
                params: {
                    messages,
                    fee,
                    feeGranter,
                    backAction,
                    successAction: () => {
                        addChainLink({
                            externalAddress: selectedWallet.bech32Address,
                            chainName: proof.chainConfig.name,
                            userAddress: selectedAccount.address,
                            creationTime: new Date()
                        })
                    }
                }
            });

        }
    }, [chain, selectedWallet, generateProof,
        selectedAccount.address, chainInfo.coinDenom, navigation,
        feeGranter, backAction, addChainLink]);

    return <StyledSafeAreaView
        style={styles.root}
        topBar={<TopBar
            stackProps={props}
            title={t("import account")}
        />}
    >
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
            <Typography.Subtitle
                style={styles.dividerText}
            >
                {t("or")}
            </Typography.Subtitle>
            <Divider style={styles.dividerLine}/>
        </View>

        <TouchableOpacity
            onPress={toggleAddressPicker}
        >
            <Typography.Subtitle style={[
                styles.toggleSelectAccount,
                !addressPickerVisible ? styles.toggleSelectAccountEnabled : null,
            ]}>
                {t("select the account you want")}
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
    toggleSelectAccount: {
        marginTop: theme.spacing.l,
    },
    toggleSelectAccountEnabled: {
        color: theme.colors.primary,
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
}));