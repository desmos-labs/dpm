import React from "react";
import {Any} from "cosmjs-types/google/protobuf/any";
import {MsgSaveProfile} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile";
import {toHex} from "@cosmjs/encoding";
import {EncodeObject} from "@cosmjs/proto-signing";
import {SaveProfileMessage} from "./SaveProfileMessage";
import {UnknownTxMessage} from "./UnknownTxMessage";
import {MessageSend} from "./MessageSend";
import {MsgMultiSend, MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {MsgTypes} from "../../types/msgtypes";
import {MessageVote} from "./MessageVote";
import {MsgVote} from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {MessageDelegate} from "./MessageDelegate";
import {MsgDelegate} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import {MessageWithdrawDelegatorRewards} from "./MessageWithdrawDelegatorRewards";
import {MsgWithdrawDelegatorReward} from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import {MessageLinkChainAccount} from "./MessageLinkChainAccount";
import {MsgLinkChainAccount, MsgUnlinkChainAccount} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_chain_links";
import {MessageUnlinkChainAccount} from "./MessageUnlinkChainAccount";
import {MessageMultiSend} from "./MessageMultiSend";


export type Props = {
    /**
     * The message to display.
     */
    message: Any | EncodeObject
}

export const TxMessage: React.FC<Props> = (props) => {

    const {typeUrl, value} = props.message;
    const isProtobuf = isProtobufMessage(props.message);

    if (typeUrl === MsgTypes.MsgSaveProfile) {
        if (isProtobuf) {
            const msgSaveProfile = MsgSaveProfile.decode(value);
            return <SaveProfileMessage protobufObject={msgSaveProfile}/>
        } else {
            return <SaveProfileMessage encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgSend) {
        if (isProtobuf) {
            const decodedMessage = MsgSend.decode(value);
            return <MessageSend protobufMessage={decodedMessage}/>
        } else {
            return <MessageSend encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgMultiSend) {
        if (isProtobuf) {
            const decodedMessage = MsgMultiSend.decode(value);
            return <MessageMultiSend protobufMessage={decodedMessage}/>
        } else {
            return <MessageMultiSend encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgVote) {
        if (isProtobuf) {
            const decodedMessage = MsgVote.decode(value);
            return <MessageVote protobufMessage={decodedMessage}/>
        } else {
            return <MessageVote encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgDelegate) {
        if (isProtobuf) {
            const decodedMessage = MsgDelegate.decode(value);
            return <MessageDelegate protobufMessage={decodedMessage}/>
        } else {
            return <MessageDelegate encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgWithdrawDelegatorReward) {
        if (isProtobuf) {
            const decodedMessage = MsgWithdrawDelegatorReward.decode(value);
            return <MessageWithdrawDelegatorRewards
                protobufMessage={decodedMessage}/>
        } else {
            return <MessageWithdrawDelegatorRewards
                encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgLinkChainAccount) {
        if (isProtobuf) {
            const decodedMessage = MsgLinkChainAccount.decode(value);
            return <MessageLinkChainAccount
                protobufMessage={decodedMessage}/>
        } else {
            return <MessageLinkChainAccount
                encodeObject={value}/>
        }
    } else if (typeUrl === MsgTypes.MsgUnlinkChainAccount) {
        if (isProtobuf) {
            const decodedMessage = MsgUnlinkChainAccount.decode(value);
            return <MessageUnlinkChainAccount
                protobufMessage={decodedMessage}/>
        } else {
            return <MessageUnlinkChainAccount
                encodeObject={value}/>
        }
    } else {
        return <UnknownTxMessage
            typeUrl={typeUrl}
            value={isProtobuf ? toHex(value) : JSON.stringify(value)}
        />
    }

}

function isProtobufMessage(msg: EncodeObject | Any): boolean {
    return msg.value.constructor === Uint8Array;
}