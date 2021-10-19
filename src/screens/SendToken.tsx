import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import React, {useCallback, useState} from "react";
import {Button, Paragraph, StyledSafeAreaView, Subtitle, TextInput, TopBar} from "../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import useSelectedAccount from "../hooks/useSelectedAccount";
import useFetchUserBalance from "../hooks/useFetchUserBalance";
import {FlexPadding} from "../components/FlexPadding";

export type Props = StackScreenProps<AccountScreensStackParams, "SendToken">

export const SendToken: React.FC<Props> = (props) => {
    const {t} = useTranslation();
    const styles = useStyle();
    const currentAccount = useSelectedAccount();
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const userBalance = useFetchUserBalance(currentAccount.address);

    const onAddressChange = useCallback((address: string) => {
        setAddress(address);
    }, [])

    const onAmountChange = useCallback((amount: string) => {
        setAmount(amount);
    }, [])

    const onMemoChange = useCallback((memo: string) => {
        setMemo(memo);
    }, [])

    const onMaxPressed = useCallback(() => {
        setAmount(userBalance.amount);
    }, [userBalance])

    return <StyledSafeAreaView
        topBar={<TopBar stackProps={props} title={t("send")} />}
    >
        <Subtitle
            capitalize
        >
            {t("recipient address")}
        </Subtitle>
        <TextInput
            style={styles.topMarginSmall}
            placeholder={t("insert address")}
            value={address}
            onChangeText={onAddressChange}
            numberOfLines={1}
            multiline={false}
        />
        <TextInput
            style={styles.topMarginSmall}
            placeholder={t("insert amount")}
            value={amount}
            keyboardType="numeric"
            onChangeText={onAmountChange}
            numberOfLines={1}
            multiline={false}
            rightElement={<Button
                accent
                onPress={onMaxPressed}
            >
                {t("max")}
            </Button>}
        />
        <Paragraph
            style={styles.topMarginSmall}
        >
            {t("available")} {userBalance.amount} {userBalance.denom}
        </Paragraph>

        <Subtitle
            style={styles.topMarginMedium}
        >
            {t("note (memo)")}
        </Subtitle>
        <TextInput
            style={styles.topMarginSmall}
            placeholder={t("description (optional)")}
            value={memo}
            onChangeText={onMemoChange}
            numberOfLines={4}
            multiline={true}
        />

        <FlexPadding flex={1} />

        <Button
            mode="contained"
            disabled={address.length === 0 || amount.length === 0}
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
    }
}))