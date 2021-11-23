import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, HomeScreensBottomTabsParams} from "../types/navigation";
import {CompositeScreenProps} from "@react-navigation/native";
import {StackScreenProps} from "@react-navigation/stack";
import React, {useCallback, useState} from "react";
import {
    AvatarImage,
    StyledSafeAreaView,
    TopBar,
    AccountBalance,
    TransactionsList,
    Typography,
    AirdropBanner
} from "../components";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {useTranslation} from "react-i18next";
import useFetchProfile from "../hooks/useFetchProfile";
import {makeStyle} from "../theming";
import {Image, Text, View} from "react-native";
import {Snackbar, useTheme} from "react-native-paper";
import Clipboard from "@react-native-community/clipboard";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {BroadcastedTx} from "../types/tx";
import {useDrawerContext} from "../contexts/AppDrawerContex";
import useAirdropClaimable from "../hooks/useAirdropClaimable";

export type Props = CompositeScreenProps<
    BottomTabScreenProps<HomeScreensBottomTabsParams, "Home">,
    StackScreenProps<AccountScreensStackParams>
    >;

export const Home: React.FC<Props> = (props) => {
    const {navigation} = props;
    const {openDrawer} = useDrawerContext();
    const account = useSelectedAccount();
    const {t} = useTranslation();
    const theme = useTheme();
    const styles = useStyles();
    const profile = useFetchProfile(account.address);
    const [snackBarMessage, setShowSnackbar] = useState<string | null>(null);
    const currentChain = useCurrentChainInfo();
    const airDropClaimable = useAirdropClaimable();

    const openProfileDetails = useCallback(() => {
        navigation.navigate({
            name: "Profile",
            params: undefined,
        })
    }, [navigation])

    const onAddressCopy = useCallback(() => {
        Clipboard.setString(account.address)
        setShowSnackbar(t("address copied"));
    }, [t, account]);

    const onSendPressed = useCallback(() => {
        props.navigation.navigate({
            name: "SendToken",
            params: undefined
        })
    }, [props.navigation]);

    const onTxPressed = useCallback((tx: BroadcastedTx) => {
        navigation.navigate({
            name: "TxDetails",
            params: {
                messages: tx.msgs,
                fee: tx.fee,
                memo: tx.memo,
                success: tx.success,
                dateTime: new Date(tx.timestamp),
                hash: tx.hash,
            }
        })
    }, [navigation])

    const claimAirdrop = useCallback(() => {
        navigation.navigate({
            name: "AirdropScreens",
            params: undefined,
        })
    }, [navigation]);

    return <StyledSafeAreaView padding={0}>
        {currentChain.chainId !== "desmos-mainnet" && (
            <View style={styles.testnetBadge}>
                <Text style={styles.testnetText}>TESTNET</Text>
            </View>)}

        <Image
            source={require("../assets/home-background-light.png")}
            resizeMode={"stretch"}
            style={styles.background}
        />
        <TopBar
            style={styles.topBar}
            leftIconColor={theme.colors.icon["5"]}
            stackProps={{
                ...props,
                navigation: {
                    ...props.navigation,
                    openDrawer,
                }
            }}
            rightElement={<AvatarImage
                size={30}
                style={styles.avatarImage}
                source={profile?.profilePicture ? {
                    uri: profile.profilePicture
                } : require("../assets/default-profile-picture.png")}
                onPress={openProfileDetails}
            />}
        />
        <AccountBalance
            style={styles.userBalance}
            address={account.address}
            nickname={profile?.nickname}
            onCopyPress={onAddressCopy}
            onSendPressed={onSendPressed}
        />
        <View style={styles.transactionsContainer}>
            <Typography.Subtitle>
                {t("transactions")}
            </Typography.Subtitle>
            <TransactionsList
                style={styles.transactionList}
                onTxPressed={onTxPressed}
                chainAccount={account}
            />
        </View>
        <AirdropBanner
            style={styles.airdropBanner}
            visible={airDropClaimable}
            onClaimPressed={claimAirdrop}
        />
        <Snackbar
            visible={snackBarMessage !== null}
            style={styles.snackbar}
            onDismiss={() => setShowSnackbar(null)}
            action={{
                label: t("hide")
            }}
            duration={Snackbar.DURATION_SHORT}
        >
            <Typography.Body>
                {snackBarMessage}
            </Typography.Body>
        </Snackbar>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    testnetBadge: {
        position: "absolute",
        bottom: 5,
        right: 0,
        padding: theme.spacing.s,
        borderTopLeftRadius: theme.roundness,
        borderBottomLeftRadius: theme.roundness,
        backgroundColor: theme.colors.background,
        zIndex: 1,
        elevation: 4,
    },
    snackbar: {
        zIndex: 2,
        backgroundColor: theme.colors.popupSurface,
    },
    testnetText: {
        color: theme.colors.primary,
        fontWeight: "bold",
    },
    background: {
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    topBar: {
        backgroundColor: "transparent"
    },
    avatarImage: {
        marginRight: 16,
    },
    userBalance: {
        marginHorizontal: theme.spacing.m,
    },
    transactionsContainer: {
        backgroundColor: theme.colors.background2,
        paddingTop: theme.spacing.m,
        paddingHorizontal: theme.spacing.m,
        borderTopLeftRadius: theme.roundness,
        borderTopRightRadius: theme.roundness,
        marginTop: theme.spacing.l,
        flex: 1,
    },
    transactionList: {
        marginTop: 16,
    },
    airdropBanner: {
        position: "absolute",
        zIndex: 2,
        bottom: 0,
        width: "100%",
        height: 80,
    }
}))