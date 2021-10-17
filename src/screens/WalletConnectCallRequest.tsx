import React, {useCallback, useEffect, useMemo} from "react";
import {ScrollView, View} from "react-native";
import {Button, Paragraph, StyledSafeAreaView} from "../components";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {makeStyle} from "../theming";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {useTranslation} from "react-i18next";
import useWalletConnectRejectRequest from "../hooks/useWalletConnectRejectRequest";
import useWalletCallRequests from "../hooks/useWalletCallRequests";
import {ParsedCallRequest} from "../types/walletconnect";

export type Props = StackScreenProps<AccountScreensStackParams, "WalletConnectCallRequest">;

export const WalletConnectCallRequest: React.FC<Props> = (props) => {
    const {navigation} = props;
    const {t} = useTranslation()
    const styles = useStyles();
    const rejectRequest = useWalletConnectRejectRequest();
    const callRequests = useWalletCallRequests();

    const request: ParsedCallRequest | null = useMemo(() => {
        if (callRequests.length > 0) {
            return callRequests[0]
        } else {
            return null;
        }
    }, [callRequests])

    const onReject = useCallback(() => {
        if (request !== null) {
            rejectRequest(request.sessionId, request.requestId, "Rejected from the user");
        }
    }, [request, rejectRequest]);

    const onApprove = useCallback(() => {
        if (request !== null) {
            rejectRequest(request.sessionId, request.requestId, "Approve not implemented");
        }
    }, [request, rejectRequest]);

    useEffect(() => {
        if (request === null) {
            navigation.goBack();
        }
    }, [request, navigation])

    return request !== null ? (<StyledSafeAreaView>
        <ScrollView style={styles.txDetails}>
            <Paragraph>
                {JSON.stringify(TxBody.toJSON(request.signDoc.body))}
            </Paragraph>
        </ScrollView>
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    button: {
        width: "40%"
    }
}));