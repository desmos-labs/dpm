import React from "react";
import {EncodeObject} from "@cosmjs/proto-signing";
import {MessageSendListItem} from "./MessageSendListItem";
import {
    MsgDelegateEncodeObject, MsgLinkChainAccountEncodeObject,
    MsgSaveProfileEncodeObject,
    MsgSendEncodeObject,
    MsgVoteEncodeObject, MsgWithdrawDelegatorRewardEncodeObject
} from "@desmoslabs/sdk-core";
import {UnknownMessageListItem} from "./UnknownMessageListItem";
import {MessageSaveProfileListItem} from "./MessageSaveProfileListItem";
import {MsgTypes} from "../../../types/msgtypes";
import {MessageVoteListItem} from "./MessageVoteListItem";
import {MessageDelegateListItem} from "./MessageDelegateListItem";
import {MessageWithdrawDelegatorRewardListItem} from "./MessageWithdrawDelegatorRewardListItem";
import {MessageLinkChainAccountListItem} from "./MessageLinkChainAccountListItem";

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

        case MsgTypes.MsgVote:
            return <MessageVoteListItem
                encodeObject={encodeObject as MsgVoteEncodeObject}
                date={date}
            />

        case MsgTypes.MsgDelegate:
            return <MessageDelegateListItem
                encodeObject={encodeObject as MsgDelegateEncodeObject}
                date={date}
            />

        case MsgTypes.MsgWithdrawDelegatorReward:
            return <MessageWithdrawDelegatorRewardListItem
                encodeObject={encodeObject as MsgWithdrawDelegatorRewardEncodeObject}
                date={date}
            />

        case MsgTypes.MsgLinkChainAccount:
            return <MessageLinkChainAccountListItem
                encodeObject={encodeObject as MsgLinkChainAccountEncodeObject}
                date={date}
            />

        default:
            return <UnknownMessageListItem {...props} />
    }
}
