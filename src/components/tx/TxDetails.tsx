import React, {useMemo} from "react";
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
import Long from "long";
import {TxMessage} from "./TxMessage";
import {EncodeObject} from "@cosmjs/proto-signing";
import {Any} from "cosmjs-types/google/protobuf/any";
import {StdFee} from "@cosmjs/amino";
import {convertCoin} from "@desmoslabs/sdk-core";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {format} from "date-fns";

export type Props = {
    messages: (EncodeObject | Any)[],
    fee?: StdFee,
    memo?: string,
    success?: boolean,
    dateTime?: Date
    style?: StyleProp<ViewStyle>
}

export const TxDetails: React.FC<Props> = (props) => {
    const {memo, messages, fee, success, dateTime} = props;
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

    return <View
        style={styles.root}
        onStartShouldSetResponder={() => true}
    >
        <ScrollView style={props.style}>
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
            {dateTime && (<>
                <LabeledValue
                    label={t("time")}
                    value={format(dateTime, "dd MMM yyyy, HH:mm:ss")}
                />
                <Divider/>
            </>)}
            {success !== undefined && (<>
                <LabeledValue
                    label={t("status")}
                    value={success ? t("success") : t("fail")}
                />
                <Divider/>
            </>)}
            <LabeledValue
                label={t("memo")}
                value={(memo?.length ?? 0) > 0 ? memo : "N/A"}
            />
            <Divider/>
        </ScrollView>
    </View>
}


const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
})