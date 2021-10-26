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
            label={t("Message Type")}
            value={props.typeUrl}
        />
        <Divider />
        <LabeledValue
            label={t("Message Value")}
            value={props.value}
        />
    </View>
}