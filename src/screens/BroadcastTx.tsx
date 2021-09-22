import React, {useEffect, useMemo, useState} from "react";
import {View} from "react-native"
import {AccountScreensStackParams} from "../types/navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {Button, StyledSafeAreaView} from "../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {Subheading, TextInput, Title} from "react-native-paper";
import useUnlockWallet from "../hooks/useUnlockWallet";
import {useCurrentChainInfo, useDesmosClient} from "@desmoslabs/sdk-react";
import {BroadcastTxFailure, isBroadcastTxSuccess} from "@desmoslabs/sdk-core";
import {EncodedMessages} from "../components/EncodedMessages";
import {FeePicker} from "../components/FeePicker";
import {messagesGas, computeTxFees} from "../types/fees";

const useStyles = makeStyle(theme => ({
    msgs: {
        maxHeight: '50%',
        flex: 1
    },
    errorMsg: {
        color: theme.colors.error,
    },
    memo: {
        marginTop: theme.spacing.s,
    },
    feeSection: {
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing.s,
    },
    gasSection: {
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing.s,
    },
    btnContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: theme.spacing.s,
        justifyContent: "space-around"
    }
}))

type Props = StackScreenProps<AccountScreensStackParams, "BroadcastTx">;

export const BroadcastTx: React.FC<Props> = (props) => {
    const navigation =  props.navigation;
    const params =  props.route.params;
    const {signer, onSuccess, onCancel} = props.route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const unlockWallet = useUnlockWallet();
    const desmosClient = useDesmosClient();
    const currentChain = useCurrentChainInfo();
    const [broadcasting, setBroadcasting] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);
    const [memo, setMemo] = useState<string>("");
    const [showGas, setShowGas] = useState(false);
    const defaultGasPrice = useMemo(() => {
        return messagesGas(params.msgs);
    }, [params.msgs])
    const [gas, setGas] = useState(defaultGasPrice);
    const txFees = useMemo(() => {
        return computeTxFees(gas, currentChain.coinDenom);
    }, [gas, currentChain]);

    const [fee, setFee] = useState(txFees.average);

    const onCancelBroadcast = () => {
        navigation.pop();
    }

    const onBroadcast = async () => {
        setBroadcasting(true);
        setTxError(null);
        try {
            const wallet = await unlockWallet(signer.address);
            await desmosClient.connect();
            desmosClient.setSigner(wallet);
            const response = await desmosClient.signAndBroadcast(signer.address, params.msgs, fee, memo);
            desmosClient.setSigner(undefined);
            if (isBroadcastTxSuccess(response)) {
                console.log("Tx success");
                onSuccess();
                navigation.pop();
            } else {
                setTxError((response as BroadcastTxFailure).rawLog ?? null);
            }
        } catch (e) {
            setTxError(e.toString());
        }
        setBroadcasting(false);
    }

    useEffect(() => {
        return props.navigation.addListener("beforeRemove", e => {
            console.log("Broadcast TX beforeRemove", e);
        })
    }, [onCancel, props.navigation])

    return <StyledSafeAreaView scrollable>
        <Title>
            {t("messages")}
        </Title>

        <EncodedMessages
            style={styles.msgs}
            encodeMessages={params.msgs}
            nestedScrollEnabled
        />
        {txError && <Subheading style={styles.errorMsg}>
            {txError}
        </Subheading> }

        <Subheading>
            {t("memo")}
        </Subheading>
        <TextInput
            style={styles.memo}
            mode="outlined"
            value={memo}
            onChangeText={setMemo}
            disabled={broadcasting}
            multiline
            numberOfLines={3}
        />

        <View style={styles.feeSection}>
            <Subheading>
                {t("fee")}
            </Subheading>
            <FeePicker
                fees={txFees}
                feeLevel={'average'}
                onChange={setFee}
                disabled={broadcasting}
            />
        </View>

        <View style={styles.gasSection}>
            {showGas && <Subheading>{t("gas")}</Subheading>}
            {showGas && <TextInput
                mode="outlined"
                value={gas.toString()}
                disabled={broadcasting}
                onChangeText={text => {
                    const number = parseInt(text);
                    if (!isNaN(number)) {
                        setGas(number);
                    } else {
                        setGas(defaultGasPrice);
                    }
                }}
                keyboardType="numeric"
            />}
            <Button
                onPress={() => setShowGas((old) => !old )}
            >
                {showGas ? t("hide") : t("override gas")}
            </Button>
        </View>

        <View
            style={styles.btnContainer}
        >
            <Button
                mode="outlined"
                onPress={onCancelBroadcast}
                disabled={broadcasting}
            >
                {t("reject")}
            </Button>
            <Button
                mode="contained"
                onPress={onBroadcast}
                loading={broadcasting}
            >
                {t("approve")}
            </Button>
        </View>
    </StyledSafeAreaView>
}