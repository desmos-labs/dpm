import React from "react";
import {useTranslation} from "react-i18next";
import {MsgWithdrawDelegatorRewardEncodeObject} from "@desmoslabs/sdk-core";
import {SimpleMessageComponent} from "./SimpleMessageComponent";
import {MsgWithdrawDelegatorReward} from "cosmjs-types/cosmos/distribution/v1beta1/tx";


export type Props = {
    protobufMessage?: MsgWithdrawDelegatorReward
    encodeObject?: MsgWithdrawDelegatorRewardEncodeObject["value"],
}

export const MessageWithdrawDelegatorRewards: React.FC<Props> = ({protobufMessage, encodeObject}) => {
    const {t} = useTranslation();

    return <SimpleMessageComponent
        icon={require("../../assets/tx-icons/withdraw.png")}
        iconSubtitle={t("withdraw rewards")}
        fields={[
            {
                label: t("from"),
                value: protobufMessage?.validatorAddress ??
                    encodeObject?.validatorAddress,
            },
        ]}
    />
}
