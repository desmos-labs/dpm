import React, {useMemo} from "react";
import {ScrollView, StyleProp, View, ViewStyle} from "react-native";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
import Long from "long";
import {TxMessage} from "./TxMessage";
import {EncodeObject} from "@cosmjs/proto-signing";
import {Any} from "cosmjs-types/google/protobuf/any";
import {StdFee} from "@cosmjs/amino";
import {convertCoin} from "@desmoslabs/sdk-core";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";

export type Props = {
    messages: (EncodeObject | Any)[],
    fee?: StdFee,
    memo?: string,
    style?: StyleProp<ViewStyle>
}

export const TxDetails: React.FC<Props> = (props) => {
    const {memo, messages, fee} = props;
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();

    const txFex = useMemo(() => {
        if (fee !== undefined && fee.amount.length > 0) {
            const feeAmount = fee.amount
                .filter(coin => coin.denom === chainInfo.coinDenom)
                .map(coin => Long.fromString(coin.amount))
                .reduce((previousValue, currentValue) => previousValue.add(currentValue), Long.ZERO);

            const convertedFee = convertCoin({
                denom: chainInfo.coinDenom,
                amount: feeAmount.toString(),
            }, 6, chainInfo.denomUnits);

            if (convertedFee === null) {
                return `${feeAmount.toString(10)} ${chainInfo.coinDenom}`;
            } else {
                return `${convertedFee.amount} ${convertedFee.denom.toUpperCase()}`;
            }
        } else {
            return "0";
        }
    }, [chainInfo.coinDenom, chainInfo.denomUnits, fee])

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
