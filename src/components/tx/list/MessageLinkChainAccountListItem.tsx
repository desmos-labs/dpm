import React, {useMemo} from "react";
import {MsgLinkChainAccountEncodeObject} from "@desmoslabs/sdk-core";
import {View} from "react-native";
import {BaseMessageListItem} from "./BaseMessageListItem";
import {Typography} from "../../typography";
import {useTranslation} from "react-i18next";
import {Bech32Address} from "@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links";

export type Props = {
    encodeObject: MsgLinkChainAccountEncodeObject,
    date: Date,
}

export const MessageLinkChainAccountListItem: React.FC<Props> = (props) => {
    const {date, encodeObject} = props;
    const {chainAddress} = encodeObject.value;
    const {t} = useTranslation();

    const chainAccount = useMemo(() => {
        if (chainAddress !== undefined && chainAddress.typeUrl === "/desmos.profiles.v1beta1.Bech32Address") {
            const bech32Address = Bech32Address.decode(chainAddress.value);
            return bech32Address.value;
        } else {
            return ""
        }
    }, [chainAddress])

    return <BaseMessageListItem
        icon={require("../../../assets/tx-icons/general.png")}
        date={date}
        renderContent={() => <View>
            <Typography.Body1>{t("tx type link chain account")}</Typography.Body1>
            <Typography.Caption>{t("to")} {chainAccount}</Typography.Caption>
        </View>}
    />
}