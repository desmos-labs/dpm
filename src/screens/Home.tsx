import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, HomeScreensBottomTabsParams, HomeScreensDrawerParams} from "../types/navigation";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {StackScreenProps} from "@react-navigation/stack";
import React, {useCallback, useMemo, useState} from "react";
import {AvatarImage, StyledSafeAreaView, TopBar, AccountBalance} from "../components";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {useTranslation} from "react-i18next";
import useFetchProfile from "../hooks/useFetchProfile";
import {makeStyle} from "../theming";
import {Image, Text, View} from "react-native";
import {Snackbar} from "react-native-paper";
import Clipboard from "@react-native-community/clipboard";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";

export type Props = CompositeScreenProps<BottomTabScreenProps<HomeScreensBottomTabsParams, "Home">,
    CompositeScreenProps<DrawerScreenProps<HomeScreensDrawerParams>, StackScreenProps<AccountScreensStackParams>>>;

export const Home: React.FC<Props> = (props) => {
    const {navigation} = props;
    const account = useSelectedAccount();
    const {t} = useTranslation();
    const styles = useStyles();
    const profile = useFetchProfile(account.address);
    const [snackBarMessage, setShowSnackbar] = useState<string | null>(null);
    const currentChain = useCurrentChainInfo();

    const openProfileDetails = useCallback(() => {
        navigation.navigate({
            name: "Profile",
            params: undefined,
        })
    }, [navigation])

    const profilePicture = useMemo(() => {
        return <AvatarImage
            size={30}
            style={styles.avatarImage}
            source={profile?.cachedProfilePictureUri ? {
                uri: profile.cachedProfilePictureUri
            } : require("../assets/default-profile-picture.png")}
            onPress={openProfileDetails}
        />
    }, [styles,profile, openProfileDetails]);

    const onAddressCopy = useCallback(() => {
        Clipboard.setString(account.address)
        setShowSnackbar(t("address copied"));
    }, [t, account]);

    const onSendPressed = useCallback(() => {
        props.navigation.navigate({
            name: "SendToken",
            params: undefined
        })
    }, [props.navigation])

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
            leftIconColor="#ffffff"
            stackProps={props}
            rightElement={profilePicture}
        />
        <AccountBalance
            style={styles.userBalance}
            address={account.address}
            nickname={profile?.nickname}
            onCopyPress={onAddressCopy}
            onSendPressed={onSendPressed}
        />
        <Snackbar
            visible={snackBarMessage !== null}
            onDismiss={() => setShowSnackbar(null)}
            action={{
                label: t("hide")
            }}
            duration={Snackbar.DURATION_SHORT}
        >
            {snackBarMessage}
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
        zIndex: 999,
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
        right: 16,
    },
    userBalance: {
        marginHorizontal: theme.spacing.m,
    }
}))