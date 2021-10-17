import React, {useMemo} from "react";
import {AuthInfo, TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {ScrollView, StyleProp, ViewStyle} from "react-native";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import Long from "long";
import {TxMessage} from "./TxMessage";

export type Props = {
    body: TxBody,
    authInfo: AuthInfo,
    style?: StyleProp<ViewStyle>
}

export const TxDetails: React.FC<Props> = (props) => {
    const {memo, messages} = props.body;
    const {fee} = props.authInfo;
    const {t} = useTranslation()
    const chainInfo = useCurrentChainInfo();

    const txFex = useMemo(() => {
        if (fee) {
            const feeAmount = fee.amount
                .filter(coin => coin.denom === chainInfo.coinDenom)
                .map(coin => Long.fromString(coin.amount))
                .reduce((previousValue, currentValue) => previousValue.add(currentValue));
            return `${feeAmount.toString(10)} ${chainInfo.coinDenom}`;
        } else {
            return `0 ${chainInfo.coinDenom}`;
        }
    }, [chainInfo.coinDenom, fee])

    return <ScrollView style={props.style}>
        {messages.map((msg, i) => {
            return <>
                <TxMessage key={`msg_${i}`} message={msg} />
                <Divider />
            </>
        })}
        <LabeledValue
            label={t("fee")}
            value={txFex}
        />
        <Divider/>
        <LabeledValue
            label={t("memo")}
            value={memo}
        />
        <Divider/>
    </ScrollView>
}
