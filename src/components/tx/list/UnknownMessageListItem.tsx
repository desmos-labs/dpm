import React from "react";
import {View} from "react-native";
import {BaseMessageListItem} from "./BaseMessageListItem";
import {EncodeObject} from "@cosmjs/proto-signing";
import { Typography } from "../../typography";

export type Props = {
    encodeObject: EncodeObject,
    date: Date,
}

export const UnknownMessageListItem: React.FC<Props> = (props) => {
    const {encodeObject, date} = props;

    return <BaseMessageListItem
        encodeObject={encodeObject}
        date={date}
        renderContent={() => <View>
            <Typography.Caption>
                {JSON.stringify(encodeObject, null, 2)}
            </Typography.Caption>
        </View>}
    />
}
