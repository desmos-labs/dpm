import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {AminoMsgSend, convertCoin, MsgSendEncodeObject} from "@desmoslabs/sdk-core";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {SimpleMessageComponent} from "./SimpleMessageComponent";


export type Props = {
    protobufMessage?: MsgSend
    encodeObject?: MsgSendEncodeObject["value"],
    aminoMessage?: AminoMsgSend["value"]
}


export const MessageSend: React.FC<Props> = ({protobufMessage, encodeObject, aminoMessage}) => {
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();


    const convertedAmount = useMemo(() => {
        const amount = protobufMessage?.amount ?? encodeObject?.amount ?? aminoMessage?.amount

        return amount ? amount.map(amount => {
            const converted = convertCoin(amount, 6, chainInfo.denomUnits);
            if (converted !== null) {
                return `${converted.amount} ${converted.denom.toUpperCase()}`
            } else {
                return `${amount.amount} ${amount.denom}`
            }
        }).join("\n") : "";

    }, [protobufMessage?.amount, encodeObject?.amount, chainInfo.denomUnits, aminoMessage?.amount]);

    return <SimpleMessageComponent
        icon={require("../../assets/tx-icons/send.png")}
        iconSubtitle={convertedAmount}
        fields={[
            {
                label: t("from"),
                value: protobufMessage?.fromAddress ?? encodeObject?.fromAddress ?? ""
            },
            {
                label: t("to"),
                value: protobufMessage?.toAddress ?? encodeObject?.toAddress ?? ""
            },
            {
                label: t("amount"),
                value: convertedAmount
            },
        ]}
    />
}
