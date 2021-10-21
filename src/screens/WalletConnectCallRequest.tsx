import React, {useCallback, useEffect, useMemo} from "react";
import {View} from "react-native";
import {Button, StyledSafeAreaView, TopBar} from "../components";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {makeStyle} from "../theming";
import {useTranslation} from "react-i18next";
import useWalletConnectRejectRequest from "../hooks/useWalletConnectRejectRequest";
import useWalletCallRequests from "../hooks/useWalletCallRequests";
import {ParsedCallRequest} from "../types/walletconnect";
import {TxDetails} from "../components/tx/TxDetails";
import useSignTx from "../hooks/useSignTx";
import useUnlockWallet from "../hooks/useUnlockWallet";
import {CosmosMethod} from "../types/jsonRpCosmosc";
import {useWalletConnectContext} from "../contexts/WalletConnectContext";
import {StdFee} from "@cosmjs/amino";

export type Props = StackScreenProps<AccountScreensStackParams, "WalletConnectCallRequest">;

export const WalletConnectCallRequest: React.FC<Props> = (props) => {
    const {navigation} = props;
    const {t} = useTranslation()
    const styles = useStyles();
    const {controller, removeCallRequest} = useWalletConnectContext();
    const rejectRequest = useWalletConnectRejectRequest();
    const callRequests = useWalletCallRequests();
    const unlockWallet = useUnlockWallet();
    const signTx = useSignTx();

    const request: ParsedCallRequest | null = useMemo(() => {
        if (callRequests.length > 0) {
            return callRequests[0]
        } else {
            return null;
        }
    }, [callRequests])

    const stdFee: StdFee | undefined = useMemo(() => {
        if (request?.signDoc.authInfo.fee) {
            const {amount, gasLimit} = request.signDoc.authInfo.fee;
            return {
                amount: amount.map(c => ({amount: c.amount, denom: c.denom})),
                gas: gasLimit.toString()
            }
        } else {
            return undefined
        }
    },  [request]);

    const onReject = useCallback(() => {
        rejectRequest(request!.sessionId, request!.requestId, "Rejected from the user");
    }, [request, rejectRequest]);

    const onApprove = useCallback(async () => {
        const wallet = await unlockWallet(request!.signerAddress);
        if (wallet !== null) {
            const signature = await signTx(wallet, {
                method: CosmosMethod.SignDirect,
                tx: request!.signDoc,
            });
            controller.approveSignRequest(request!.sessionId, request!.requestId, signature);
            removeCallRequest(request!.requestId);
        }
    }, [request, unlockWallet, signTx, controller, removeCallRequest]);

    useEffect(() => {
        if (request === null) {
            navigation.goBack();
        }
    }, [request, navigation]);

    useEffect(() => {
        return navigation.addListener("beforeRemove", e => {
            if (e.data.action.type === "GO_BACK" && request !== null) {
                e.preventDefault();
            }
        })
    }, [navigation, request])

    return request !== null ? (<StyledSafeAreaView
        topBar={<TopBar
            stackProps={props}
            title={t("tx details")}
        />}
        divider
        padding={0}
    >
        <TxDetails
            style={styles.txDetails}
            messages={request.signDoc.body.messages}
            fee={stdFee}
            memo={request.signDoc.body.memo}
        />
        <View
            style={styles.buttonsContainer}
        >
            <Button
                style={styles.button}
                mode="contained"
                accent
                onPress={onReject}
            >
                {t("reject")}
            </Button>
            <Button
                style={styles.button}
                mode="contained"
                onPress={onApprove}
            >
                {t("approve")}
            </Button>
        </View>
    </StyledSafeAreaView>) : null;
}

const useStyles = makeStyle(theme => ({
    txDetails: {
        flex: 1,
    },
    buttonsContainer: {
        marginVertical: theme.spacing.m,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    button: {
        width: "40%"
    }
}));