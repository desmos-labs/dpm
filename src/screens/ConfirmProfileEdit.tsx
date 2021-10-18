import React, {useCallback, useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, RootStackParams} from "../types/navigation";
import {Button, Divider, LabeledValue, StyledSafeAreaView} from "../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {ProfileHeader} from "../components/ProfileHeader";
import {ScrollView} from "react-native";
import useUnlockWallet from "../hooks/useUnlockWallet";
import {useCurrentChainInfo, useDesmosClient} from "@desmoslabs/sdk-react";
import {DesmosProfile, MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";
import {computeTxFees, messagesGas} from "../types/fees";
import {CompositeScreenProps} from "@react-navigation/native";
import {SingleButtonModal} from "../modals/SingleButtonModal";
import useSaveProfile from "../hooks/useSaveProfile";
import useNavigateToHomeScreen from "../hooks/useNavigateToHomeScreen";
import useShowModal from "../hooks/useShowModal";
import useUploadPicture from "../hooks/useUploadPicture";
import {TopBar} from "../components";


export type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "ConfirmProfileEdit">,
    StackScreenProps<RootStackParams>>

export const ConfirmProfileEdit: React.FC<Props> = (props) => {
    const {route} = props;
    const {account, dtag, nickname, bio, coverPictureUrl, localCoverPictureUri, profilePictureUrl, localProfilePictureUri} = route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const desmosClient = useDesmosClient();
    const chainInfo = useCurrentChainInfo();
    const unlockWallet = useUnlockWallet();
    const [broadcastingTx, setBroadcastingTx] = useState(false);
    const saveProfile = useSaveProfile();
    const navigateToHomeScreen = useNavigateToHomeScreen()
    const showModal = useShowModal();
    const uploadPicture = useUploadPicture();

    const txFee = useMemo(() => {
        const saveProfileMessage: MsgSaveProfileEncodeObject = {
            typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
            value: {
                creator: account.address,
                dtag: dtag,
                nickname: nickname,
                bio: bio,
                profilePicture: profilePictureUrl,
                coverPicture: coverPictureUrl,
            }
        };
        const messages = [saveProfileMessage];
        const gas = messagesGas(messages);
        return computeTxFees(gas, chainInfo.coinDenom).average;
    }, [account.address, bio, chainInfo.coinDenom,
        coverPictureUrl, dtag, nickname, profilePictureUrl])

    const onConfirm = useCallback(async () => {
        setBroadcastingTx(true);
        try {
            const wallet = await unlockWallet(account.address);
            if (wallet !== null) {
                const profile: DesmosProfile = {
                    address: account.address,
                    dtag,
                    nickname,
                    bio,
                }

                if (localCoverPictureUri !== undefined && coverPictureUrl === undefined) {
                    const response = await uploadPicture(localCoverPictureUri);
                    profile.coverPicture = response.url;
                }
                else {
                    profile.coverPicture = coverPictureUrl;
                }

                if (localProfilePictureUri !== undefined && profilePictureUrl === undefined) {
                    const response = await uploadPicture(localProfilePictureUri);
                    profile.profilePicture = response.url;
                }
                else {
                    profile.profilePicture = profilePictureUrl;
                }

                const saveProfileMessage: MsgSaveProfileEncodeObject = {
                    typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
                    value: {
                        creator: account.address,
                        ...profile,
                    }
                };
                const messages = [saveProfileMessage];
                await desmosClient.connect();
                desmosClient.setSigner(wallet);
                await desmosClient.signAndBroadcast(account.address, messages, txFee);
                await saveProfile(profile, {
                    profilePicture: localProfilePictureUri,
                    coverPicture: localCoverPictureUri,
                })
                showModal(SingleButtonModal, {
                    image: require("../assets/success.png"),
                    title: t("success"),
                    message: t("profile saved"),
                    actionLabel: t("go to profile"),
                    action: () => navigateToHomeScreen(true),
                });
            }
        } catch (e) {
            showModal(SingleButtonModal, {
                image: require("../assets/failure.png"),
                title: t("ops"),
                message: `${t("unexpected error occurred")}\n${e.toString()}`,
                actionLabel: t("close"),
                action: (navigation) => {navigation.goBack()},
            })
        }
        setBroadcastingTx(false);
    }, [unlockWallet, account, dtag, nickname, bio,
        localCoverPictureUri, coverPictureUrl, localProfilePictureUri,
        profilePictureUrl, desmosClient, txFee, saveProfile, showModal,
        t, uploadPicture, navigateToHomeScreen])

    return <StyledSafeAreaView
        padding={0}
        topBar={<TopBar stackProps={props} title={t("confirm")}/>}
    >
        <ProfileHeader
            coverPictureUri={localCoverPictureUri}
            profilePictureUri={localProfilePictureUri}
        />
        <ScrollView style={styles.details}>
            <LabeledValue
                label={t("nickname")}
                value={nickname}
            />
            <Divider/>

            <LabeledValue
                label={t("dtag")}
                value={dtag}
            />
            <Divider/>

            <LabeledValue
                label={t("bio")}
                value={bio}
            />
            <Divider/>

            <LabeledValue
                label={t("address")}
                value={account.address}
            />
            <Divider/>

            <LabeledValue
                label={t("tx type")}
                value={t("tx type save profile")}
            />
            <Divider/>

            <LabeledValue
                label={t("fee")}
                value={`${txFee.amount[0].amount} ${txFee.amount[0].denom}`}
            />
            <Divider/>
        </ScrollView>

        <Button
            style={styles.confirmBtn}
            mode="contained"
            onPress={onConfirm}
            loading={broadcastingTx}
            disabled={broadcastingTx}
        >
            {!broadcastingTx ? t("confirm") : t("broadcasting tx")}
        </Button>

    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    details: {
        flex: 1,
    },
    confirmBtn: {
        margin: theme.spacing.m
    }
}));