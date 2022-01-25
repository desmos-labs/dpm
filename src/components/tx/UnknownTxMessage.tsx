import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import {LabeledValue} from "../LabeledValue";
import {Divider} from "../Divider";

export type UnknownTxMessageProps = {
    typeUrl: string,
    value: string,
}

export const UnknownTxMessage: React.FC<UnknownTxMessageProps> = (props) => {
    const {t} = useTranslation();

    return <View>
        <LabeledValue
            label={t("message type")}
            value={props.typeUrl}
        />
        <Divider />
        <LabeledValue
            label={t("message value")}
            value={props.value}
        />
    </View>
}
