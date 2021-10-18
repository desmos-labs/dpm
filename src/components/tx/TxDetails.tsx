import React, {useMemo} from "react";
import {AuthInfo, TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {ScrollView, StyleProp, ViewStyle} from "react-native";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
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
        {messages.map((msg, i) => {
            return <>
                <TxMessage key={`msg_${i}`} message={msg} />
                <Divider key={`divider_${i}`}/>
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
