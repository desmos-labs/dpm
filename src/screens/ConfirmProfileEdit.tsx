import React, {useCallback, useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, resetTo, RootStackParams} from "../types/navigation";
import {Button, Divider, LabeledValue, StyledSafeAreaView, TopBar} from "../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {ProfileHeader} from "../components/ProfileHeader";
import {ScrollView, View} from "react-native";
import useUnlockWallet from "../hooks/useUnlockWallet";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {convertCoin, DesmosProfile, MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";
import {computeTxFees, messagesGas} from "../types/fees";
import {CompositeScreenProps} from "@react-navigation/native";
import {SingleButtonModal} from "../modals/SingleButtonModal";
import useSaveProfile from "../hooks/useSaveProfile";
import useNavigateToHomeScreen from "../hooks/useNavigateToHomeScreen";
import useShowModal from "../hooks/useShowModal";
import useUploadPicture from "../hooks/useUploadPicture";
import useBroadcastMessages from "../hooks/useBroadcastMessages";


export type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "ConfirmProfileEdit">,
    StackScreenProps<RootStackParams>>

export const ConfirmProfileEdit: React.FC<Props> = (props) => {
    const {route} = props;
    const {account, profile, localCoverPictureUri, localProfilePictureUri, feeGranter, goBackTo} = route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const chainInfo = useCurrentChainInfo();
    const unlockWallet = useUnlockWallet();
    const [broadcastingTx, setBroadcastingTx] = useState(false);
    const saveProfile = useSaveProfile();
    const navigateToHomeScreen = useNavigateToHomeScreen()
    const showModal = useShowModal();
    const uploadPicture = useUploadPicture();
    const broadcastMessages = useBroadcastMessages();

    const txFee = useMemo(() => {
        const saveProfileMessage: MsgSaveProfileEncodeObject = {
            typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
            value: {
                creator: account.address,
                dtag: profile.dtag,
                nickname: profile.nickname,
                bio: profile.bio,
                profilePicture: profile.profilePicture,
                coverPicture: profile.coverPicture,
            }
        };
        const messages = [saveProfileMessage];
        const gas = messagesGas(messages);
        return computeTxFees(gas, chainInfo.coinDenom).average;
    }, [account.address, profile, chainInfo.coinDenom])

    const convertedTxFee = useMemo(() => {
        const converted = convertCoin(txFee.amount[0], 6, chainInfo.denomUnits);
        return converted !== null ? converted : txFee.amount[0];
    }, [chainInfo.denomUnits, txFee.amount])

    const onConfirm = useCallback(async () => {
        setBroadcastingTx(true);
        try {
            const wallet = await unlockWallet(account);
            if (wallet !== null) {
                const newProfile: DesmosProfile = {
                    ...profile
                }

                if (localCoverPictureUri !== undefined) {
                    const response = await uploadPicture(localCoverPictureUri);
                    newProfile.coverPicture = response.url;
                } else {
                    newProfile.coverPicture = undefined;
                }

                if (localProfilePictureUri !== undefined) {
                    const response = await uploadPicture(localProfilePictureUri);
                    newProfile.profilePicture = response.url;
                } else {
                    newProfile.profilePicture = undefined;
                }

                if (newProfile.bio?.length === 0) {
                    newProfile.bio = undefined;
                }

                if (newProfile.nickname?.length === 0) {
                    newProfile.nickname = undefined;
                }

                const saveProfileMessage: MsgSaveProfileEncodeObject = {
                    typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
                    value: {
                        creator: account.address,
                        ...newProfile,
                    }
                };
                const messages = [saveProfileMessage];
                await broadcastMessages(wallet, messages, txFee, undefined, feeGranter);
                await saveProfile(profile);

                showModal(SingleButtonModal, {
                    image: "success",
                    title: t("success"),
                    message: t("profile saved"),
                    actionLabel: goBackTo === undefined ? t("go to profile") :
                        t("continue"),
                    action: goBackTo === undefined ?
                        () => navigateToHomeScreen({reset: true}) :
                        () => props.navigation.dispatch(resetTo(goBackTo))
                });
            }
        } catch (e) {
            showModal(SingleButtonModal, {
                image: "fail",
                title: t("ops"),
                message: `${t("unexpected error occurred")}\n${e.toString()}`,
                actionLabel: t("close"),
                action: (navigation) => {navigation.goBack()},
            })
        }
        setBroadcastingTx(false);
    }, [unlockWallet, account, profile, localCoverPictureUri,
        localProfilePictureUri, broadcastMessages, txFee, feeGranter,
        saveProfile, showModal, t, goBackTo, uploadPicture, navigateToHomeScreen, props.navigation])

    return <StyledSafeAreaView
        padding={0}
        topBar={<TopBar stackProps={props} title={t("confirm")}/>}
    >
        <ProfileHeader
            coverPictureUri={localCoverPictureUri ?? profile.coverPicture}
            profilePictureUri={localProfilePictureUri ?? profile.profilePicture}
        />
        <View
            style={styles.details}
            onStartShouldSetResponder={() => true}
        >
            <ScrollView>
                <LabeledValue
                    label={t("nickname")}
                    value={profile.nickname}
                />
                <Divider/>

                <LabeledValue
                    label={t("dtag")}
                    value={profile.dtag}
                />
                <Divider/>

                <LabeledValue
                    label={t("bio")}
                    value={profile.bio}
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
                    value={`${convertedTxFee.amount} ${convertedTxFee.denom.toUpperCase()}`}
                />
                <Divider/>
            </ScrollView>
        </View>

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