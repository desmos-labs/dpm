import React, {useCallback, useState} from "react";
import {Button, StyledSafeAreaView, TopBar} from "../components";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {useTranslation} from "react-i18next";
import {TxDetails} from "../components/tx/TxDetails";
import {makeStyle} from "../theming";
import useUnlockWallet from "../hooks/useUnlockWallet";
import useSelectedAccount from "../hooks/useSelectedAccount";
import useShowModal from "../hooks/useShowModal";
import {SingleButtonModal} from "../modals/SingleButtonModal";
import useNavigateToHomeScreen from "../hooks/useNavigateToHomeScreen";
import useBroadcastMessages from "../hooks/useBroadcastMessages";

export type Props = StackScreenProps<AccountScreensStackParams, "ConfirmTx">

export const ConfirmTx: React.FC<Props> = (props) => {
    const {messages, memo, fee} = props.route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const currentAccount = useSelectedAccount();
    const broadcastMessages = useBroadcastMessages();
    const unlockWallet = useUnlockWallet();
    const showModal = useShowModal();
    const [broadcastingTx, setBroadcastingTx] = useState(false);
    const navigateToHomeScreen = useNavigateToHomeScreen();

    const showSuccessModal = useCallback(() => {
        showModal(SingleButtonModal, {
            image: require("../assets/result-sucess-light.png"),
            title: t("success"),
            message: `${t("transaction sent successfully")}!`,
            actionLabel: t("go to profile"),
            action: () => navigateToHomeScreen({reset: true}),
        })
    }, [showModal, t, navigateToHomeScreen])

    const showErrorModal = useCallback((error: string) => {
        showModal(SingleButtonModal, {
            image: require("../assets/result-fail-light.png"),
            title: t("failure"),
            message: error,
            actionLabel: t("ok"),
        })
    }, [showModal, t])

    const broadcastTx = useCallback(async () => {
        setBroadcastingTx(true);
        const wallet = await unlockWallet(currentAccount.address);
        if (wallet !== null) {
            try {
                await broadcastMessages(wallet, messages, fee);
                showSuccessModal();
            } catch (e) {
                showErrorModal(e.toString())
            }
        }
        setBroadcastingTx(false);
    }, [broadcastMessages, currentAccount.address,
        fee, messages, showErrorModal, showSuccessModal, unlockWallet])

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={props}
            title={t("tx details")}
        />}
    >
        <TxDetails
            messages={messages}
            memo={memo}
            fee={fee}
        />
        <Button
            style={styles.nextBtn}
            mode="contained"
            onPress={broadcastTx}
            loading={broadcastingTx}
            disabled={broadcastingTx}
        >
            {!broadcastingTx ? t("confirm") : t("broadcasting tx")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    nextBtn: {
        marginTop: theme.spacing.m,
    }
}));