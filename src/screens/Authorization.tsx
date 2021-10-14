import React, {useCallback, useEffect, useMemo} from "react";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, AppDrawerParams, HomeScreenBottomTabsParams} from "../types/navigation";
import {FlatList} from "react-native";
import {
    AvatarImage,
    DAppSession as DAppSessionComponent,
    ListItemSeparator,
    StyledSafeAreaView,
    TopBar
} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {StackScreenProps} from "@react-navigation/stack";
import {useTranslation} from "react-i18next";
import useWalletConnectSessions from "../hooks/useWalletConnectSessions";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {DAppSession, DAppPermissions} from "../types/dapp";
import {makeStyle} from "../theming";
import useProfiles from "../hooks/useProfiles";
import useWalletConnectTerminate from "../hooks/useWalletConnectTerminate";
import useShowModal from "../hooks/useShowModal";
import {TwoButtonModal} from "../modals/TwoButtonModal";
import useUnlockWallet from "../hooks/useUnlockWallet";
import {SingleButtonModal} from "../modals/SingleButtonModal";

export type Props = CompositeScreenProps<
    BottomTabScreenProps<HomeScreenBottomTabsParams, "Authorization">,
    CompositeScreenProps<
        DrawerScreenProps<AppDrawerParams>, StackScreenProps<AccountScreensStackParams>>
    >;

export const Authorization: React.FC<Props> = (props) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const currentAccount = useSelectedAccount();
    const profiles = useProfiles();
    const sessions = useWalletConnectSessions(currentAccount);
    const showModal = useShowModal();
    const [revokeStatus, walletConnectTerminate] = useWalletConnectTerminate();
    const unlockWallet = useUnlockWallet();

    const profilePicture = useMemo(() => {
        const userProfile = profiles[currentAccount.address];
        if (userProfile?.cachedProfilePictureUri !== undefined) {
            return {
                uri: userProfile.cachedProfilePictureUri
            }
        } else {
            return require("../assets/default-profile-picture.png");
        }
    }, [currentAccount, profiles]);

    const dAppSessions = useMemo(() => {
        const dAppSessions: DAppSession[] = [];
        for (let session of sessions) {
            let iconUri: string | undefined;
            if (session.peerMeta?.icons !== undefined && session.peerMeta?.icons.length > 0) {
                iconUri = session.peerMeta?.icons[0];
            }
            dAppSessions.push({
                id: session.id,
                name: session.peerMeta?.name ?? "Undefined name",
                creationDate: session.creationDate,
                // Wallet connect use this permissions.
                permissions: [DAppPermissions.RequestTxSign, DAppPermissions.BroadcastSignedTx],
                iconUri: iconUri,
            })
        }
        return dAppSessions;
    }, [sessions])

    const revokeAuthorization = useCallback(async (dAppSession: DAppSession) => {
        const wallet = await unlockWallet(currentAccount.address);
        if (wallet !== null) {
            walletConnectTerminate(dAppSession.id);
        }
    }, [currentAccount, walletConnectTerminate, unlockWallet]);

    const openRevokePopup = useCallback((dAppSession: DAppSession) => {
        showModal(TwoButtonModal, {
            title: t("revoke"),
            message: t("are you sure you want to remove dapp?", {dapp: dAppSession.name}),
            positiveActionLabel: t("yes"),
            positiveAction: () => revokeAuthorization(dAppSession),
            negativeActionLabel: t("cancel"),
        })
    }, [showModal, t, revokeAuthorization]);

    useEffect(() => {
        if (revokeStatus.error) {
            showModal(SingleButtonModal, {
                image: require("../assets/failure.png"),
                title: t("error"),
                message: revokeStatus.error,
                actionLabel: t("ok"),
            })
        }
    }, [revokeStatus, showModal, t]);

    return <StyledSafeAreaView
        style={styles.background}
        topBar={<TopBar
            style={styles.background}
            stackProps={props}
            title={t("authorization")}
            rightElement={<AvatarImage
                style={styles.avatarImage}
                size={30}
                source={profilePicture}
            />}
        />}
    >
        <FlatList
            data={dAppSessions}
            renderItem={({item}) => {
                return <DAppSessionComponent
                    session={item}
                    onRevoke={openRevokePopup}
                />
            }}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ListItemSeparator}
        />
    </StyledSafeAreaView>
}

const useStyles = makeStyle(_ => ({
    background: {
        backgroundColor: "#e5e5e5"
    },
    avatarImage: {
        right: 16,
    }
}))