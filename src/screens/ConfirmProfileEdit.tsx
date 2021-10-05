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
import useNavigateToAccountScreen from "../hooks/useNavigateToAccountScreen";
import useShowModal from "../hooks/useShowModal";

export type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "ConfirmProfileEdit">,
    StackScreenProps<RootStackParams>>

export const ConfirmProfileEdit: React.FC<Props> = ({route}) => {

    const {account, profile, newDtag, newNickName, newBio} = route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const desmosClient = useDesmosClient();
    const chainInfo = useCurrentChainInfo();
    const unlockWallet = useUnlockWallet();
    const [broadcastingTx, setBroadcastingTx] = useState(false);
    const saveProfile = useSaveProfile();
    const navigateToAccountScreen = useNavigateToAccountScreen()
    const showModal = useShowModal();

    const newProfile = useMemo(() => {
        return {
            address: account.address,
            dtag: newDtag,
            nickname: newNickName ?? profile?.nickname,
            bio: newBio ?? profile?.bio,
            profilePicture: profile?.profilePicture,
            coverPicture: profile?.coverPicture
        } as DesmosProfile
    }, [account.address, newBio, newDtag, newNickName, profile?.bio, profile?.coverPicture, profile?.nickname, profile?.profilePicture])

    const txMessages = useMemo(() => {
        const msg: MsgSaveProfileEncodeObject = {
            typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
            value: {
                ...newProfile,
                creator: account.address,
            }
        };
        return [msg];
    }, [newProfile, account])

    const txFee = useMemo(() => {
        const gas = messagesGas(txMessages);
        return computeTxFees(gas, chainInfo.coinDenom).average;
    }, [txMessages, chainInfo.coinDenom])

    const onConfirm = useCallback(async () => {
        setBroadcastingTx(true);
        try {
            const wallet = await unlockWallet(account.address);
            if (wallet !== null) {
                await desmosClient.connect();
                desmosClient.setSigner(wallet);
                await desmosClient.signAndBroadcast(account.address, txMessages, txFee);
                await saveProfile(newProfile);
                showModal(SingleButtonModal, {
                    image: require("../assets/success.png"),
                    title: t("success"),
                    message: t("profile saved"),
                    actionLabel: t("go to profile"),
                    action: () => {
                        navigateToAccountScreen(account, true);
                    },
                })
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
    }, [unlockWallet, account, desmosClient, txMessages, txFee,
        saveProfile, newProfile, showModal, t, navigateToAccountScreen])

    return <StyledSafeAreaView padding={0}>
        <ProfileHeader
            coverPictureUri={profile?.cachedCoverPictureUri}
            profilePictureUri={profile?.cachedProfilePictureUri}
        />
        <ScrollView style={styles.details}>
            {newProfile.nickname && <>
                <LabeledValue
                    label={t("nickname")}
                    value={newProfile.nickname}
                />
                <Divider/>
            </>}

            <LabeledValue
                label={t("dtag")}
                value={newProfile.dtag}
            />
            <Divider/>

            {newProfile.bio && <>
                <LabeledValue
                    label={t("bio")}
                    value={newProfile.bio}
                />
                <Divider/>
            </>}

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
        flexGrow: 1,
    },
    confirmBtn: {
        margin: theme.spacing.m
    }
}));