import React from "react";
import {MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";
import {View} from "react-native";
import {BaseMessageListItem} from "./BaseMessageListItem";
import {Typography} from "../../typography";
import {useTranslation} from "react-i18next";

export type Props = {
    encodeObject: MsgSaveProfileEncodeObject,
    date: Date,
}

export const MessageSaveProfileListItem: React.FC<Props> = (props) => {
    const {encodeObject, date} = props;
    const {t} = useTranslation();

    return <BaseMessageListItem
        encodeObject={encodeObject}
        date={date}
        renderContent={() => <View>
            <Typography.Body1>{t("tx type save profile")}</Typography.Body1>
        </View>}
    />
}