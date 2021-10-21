import React, {useMemo} from "react";
import {ScrollView, StyleProp, View, ViewStyle} from "react-native";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
import Long from "long";
import {TxMessage} from "./TxMessage";
import {EncodeObject} from "@cosmjs/proto-signing";
import {Any} from "cosmjs-types/google/protobuf/any";
import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";

export type TxFee = {
    amount: Coin[];
    gasLimit: Long;
}

export type Props = {
    messages: (EncodeObject | Any)[],
    fee?: TxFee,
    memo?: string,
    style?: StyleProp<ViewStyle>
}

export const TxDetails: React.FC<Props> = (props) => {
    const {memo, messages, fee} = props;
    const {t} = useTranslation()

    const txFex = useMemo(() => {
        if (fee !== undefined && fee.amount.length > 0) {
            const denom = fee.amount[0].denom;
            const feeAmount = fee.amount
                .map(coin => Long.fromString(coin.amount))
                .reduce((previousValue, currentValue) => previousValue.add(currentValue), Long.ZERO);
            return `${feeAmount.toString(10)} ${denom}`;
        } else {
            return "0";
        }
    }, [fee])

    return <ScrollView style={props.style}>
        {messages.map((msg: EncodeObject | Any, i: number) => {
            return <View key={`view_${i}`}>
                <TxMessage key={`msg_${i}`} message={msg}/>
                <Divider key={`divider_${i}`}/>
            </View>
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
