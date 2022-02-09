import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import React, {useCallback, useState} from "react";
import {Button, StyledSafeAreaView, TextInput, TopBar, Typography} from "../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import useSelectedAccount from "../hooks/useSelectedAccount";
import useFetchUserBalance from "../hooks/useFetchUserBalance";
import {FlexPadding} from "../components/FlexPadding";
import {MsgSendEncodeObject} from "@desmoslabs/sdk-core";
import {computeTxFees, messagesGas} from "../types/fees";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {checkDesmosAddress} from "../utilils/validators";
import {MEMO_MAX_LENGTH} from "../constants/chain";
import {decimalSeparator, localeParseFloat} from "../utilils/parsing";

export type Props = StackScreenProps<AccountScreensStackParams, "SendToken">

export const SendToken: React.FC<Props> = (props) => {
    const {navigation} = props;
    const {t} = useTranslation();
    const styles = useStyle();
    const currentAccount = useSelectedAccount();
    const [address, setAddress] = useState("");
    const [addressInvalid, setAddressInvalid] = useState(false);
    const [amount, setAmount] = useState("");
    const [amountInvalid, setAmountInvalid] = useState(false);
    const [memo, setMemo] = useState("");
    const userBalance = useFetchUserBalance(currentAccount.address);
    const chainInfo = useCurrentChainInfo();
    const nextDisabled = addressInvalid || amountInvalid ||
        address.length === 0 || amount.length === 0;

    const onAddressChange = useCallback((newAddress: string) => {
        setAddress(newAddress);
        setAddressInvalid(newAddress.length > 0 && !checkDesmosAddress(newAddress));
    }, []);

    const onAmountChange = useCallback((amount: string) => {
        const separator = decimalSeparator();
        let isValid = amount.length === 0 || new RegExp(`^[0-9]+(\\${separator})?[0-9]*$`).test(amount);
        if (isValid && amount.length > 0) {
            const value = localeParseFloat(amount)
            const balance = parseFloat(userBalance.amount);
            isValid = balance >= value;
        }
        setAmountInvalid(!isValid);
        setAmount(amount);
    }, [userBalance]);

    const onMemoChange = useCallback((memo: string) => {
        setMemo(memo);
    }, [])

    const onMaxPressed = useCallback(() => {
        setAmount(userBalance.amount);
    }, [userBalance]);

    const onNextPressed = useCallback(() => {
        const amountNumber = Math.floor(localeParseFloat(amount) * 1000000);

        const msgSend: MsgSendEncodeObject = {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: {
                fromAddress: currentAccount.address,
                toAddress: address,
                amount: [{amount: amountNumber.toString(), denom: chainInfo.coinDenom}],
            }
        }
        const gas = messagesGas([msgSend]);
        const txFee = computeTxFees(gas, chainInfo.coinDenom).average;

        navigation.navigate({
            name: "ConfirmTx",
            params: {
                messages: [msgSend],
                fee: txFee
            }
        })
    }, [address, amount, chainInfo.coinDenom, currentAccount.address, navigation])

    return <StyledSafeAreaView
        topBar={<TopBar stackProps={props} title={t("send")} />}
    >
        <Typography.Subtitle>
            {t("recipient address")}
        </Typography.Subtitle>
        <TextInput
            style={styles.topMarginSmall}
            placeholder={t("insert address")}
            value={address}
            onChangeText={onAddressChange}
            numberOfLines={1}
            error={addressInvalid}
        />
        <TextInput
            style={styles.topMarginSmall}
            placeholder={t("insert amount")}
            value={amount}
            keyboardType="numeric"
            onChangeText={onAmountChange}
            numberOfLines={1}
            error={amountInvalid}
            rightElement={<Button
                onPress={onMaxPressed}
            >
                {t("max")}
            </Button>}
        />
        <Typography.Body
            style={styles.topMarginSmall}
        >
            {t("available")} {userBalance.amount} {userBalance.denom}
        </Typography.Body>

        <Typography.Subtitle
            style={styles.topMarginMedium}
        >
            {t("tx note")}
        </Typography.Subtitle>
        <TextInput
            style={[styles.topMarginSmall, styles.memoInput]}
            placeholder={t("tx description")}
            value={memo}
            onChangeText={onMemoChange}
            numberOfLines={4}
            maxLength={MEMO_MAX_LENGTH}
            multiline={true}
        />

        <FlexPadding flex={1}/>

        <Button
            mode="contained"
            disabled={nextDisabled}
            onPress={onNextPressed}
        >
            {t("next")}
        </Button>
    </StyledSafeAreaView>
}

const useStyle = makeStyle(theme => ({
    topMarginMedium: {
        marginTop: theme.spacing.m,
    },
    topMarginSmall: {
        marginTop: theme.spacing.s,
    },
    memoInput: {
        maxHeight: 200,
    }
}))