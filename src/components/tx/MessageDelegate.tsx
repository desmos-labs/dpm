import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {convertCoin, MsgDelegateEncodeObject} from "@desmoslabs/sdk-core";
import {SimpleMessageComponent} from "./SimpleMessageComponent";
import {MsgDelegate} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";


export type Props = {
    protobufMessage?: MsgDelegate
    encodeObject?: MsgDelegateEncodeObject["value"],
}

export const MessageDelegate: React.FC<Props> = ({protobufMessage, encodeObject}) => {
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();

    const amount = useMemo(() => {
        const amount = protobufMessage?.amount ?? encodeObject?.amount
        if (amount !== undefined) {
            const converted = convertCoin(amount, 6, chainInfo.denomUnits);
            if (converted !== null){
                return `${converted.amount} ${converted.denom.toUpperCase()}`
            } else {
                return "";
            }
        } else {
            return ""
        }

    }, [protobufMessage?.amount, encodeObject?.amount, chainInfo.denomUnits]);


    return <SimpleMessageComponent
        icon={require("../../assets/tx-icons/delegate.png")}
        iconSubtitle={`${t("delegate")} ${amount}`}
        fields={[
            {
                label: t("amount"),
                value: amount,
            },
            {
                label: t("from"),
                value: protobufMessage?.delegatorAddress ??
                    encodeObject?.delegatorAddress ?? ""
            },
            {
                label: t("to"),
                value: protobufMessage?.validatorAddress ??
                    encodeObject?.validatorAddress ?? ""
            }
        ]}
    />
}
