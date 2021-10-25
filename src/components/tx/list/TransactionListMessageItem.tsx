import React from "react";
import {EncodeObject} from "@cosmjs/proto-signing";
import {MessageSendListItem} from "./MessageSendListItem";
import {MsgSaveProfileEncodeObject, MsgSendEncodeObject} from "@desmoslabs/sdk-core";
import {UnknownMessageListItem} from "./UnknownMessageListItem";
import {MessageSaveProfileListItem} from "./MessageSaveProfileListItem";
import {MsgTypes} from "../../../types/msgtypes";

export type Props = {
    encodeObject: EncodeObject,
    date: Date,
}

export const TransactionListMessageItem: React.FC<Props> = (props) => {
    const {encodeObject, date} = props;

    switch (encodeObject.typeUrl) {
        case MsgTypes.MsgSend:
            return <MessageSendListItem
                encodeObject={encodeObject as MsgSendEncodeObject}
                date={date} />

        case MsgTypes.MsgSaveProfile:
            return <MessageSaveProfileListItem
                encodeObject={encodeObject as MsgSaveProfileEncodeObject}
                date={date}
            />

        default:
            return <UnknownMessageListItem {...props} />
    }
}
