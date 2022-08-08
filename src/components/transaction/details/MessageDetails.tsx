import { AminoMsg } from '@cosmjs/amino/build/signdoc';
import { toHex } from '@cosmjs/encoding';
import { EncodeObject } from '@cosmjs/proto-signing';
import { Any } from 'cosmjs-types/google/protobuf/any';
import React, { useMemo } from 'react';
import MsgTypes from '../../../types/msgtypes';
import { MessageDelegateDetails } from '../messages/staking/MessageDelegateDetails';
import { MessageLinkChainAccountDetails } from '../messages/profiles/MessageLinkChainAccountDetails';
import { MessageMultiSendDetails } from '../messages/bank/MessageMultiSendDetails';
import { MessageSendDetails } from '../messages/bank/MessageSendDetails';
import { MessageUnlinkChainAccountDetails } from '../messages/profiles/MessageUnlinkChainAccountDetails';
import { MessageVoteDetails } from '../messages/gov/MessageVoteDetails';
import { MessageWithdrawDelegatorRewardsDetails } from '../messages/staking/MessageWithdrawDelegatorRewardsDetails';
import { MessageSaveProfileDetails } from '../messages/profiles/MessageSaveProfileDetails';
import { MessageUnknownDetails } from '../messages/unknown/MessageUnknownDetails';

export type Props = {
  /**
   * The message to display.
   */
  message: EncodeObject;
};

export const MessageDetails: React.FC<Props> = ({ message }) => {
  const msg: TypedMessage = useMemo(() => resolveMessageType(message), [message]);

  const encodeObject = useMemo(() => {
    if (msg.type === MessageType.EncodeObject_MSG_TYP) {
      return msg.encodeObject;
    }
    return undefined;
  }, [msg]);

  const aminoMessage = useMemo(() => {
    if (msg.type === MessageType.AminoMsg_MSG_TYP) {
      return msg.aminoMsg;
    }
    return undefined;
  }, [msg]);

  if (msg.typeUrl === MsgTypes.MsgSaveProfile) {
    return <MessageSaveProfileDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgSend) {
    return <MessageSendDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgMultiSend) {
    return <MessageMultiSendDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgVote) {
    return <MessageVoteDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgDelegate) {
    return <MessageDelegateDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgWithdrawDelegatorReward) {
    return <MessageWithdrawDelegatorRewardsDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgLinkChainAccount) {
    return <MessageLinkChainAccountDetails message={encodeObject?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgUnlinkChainAccount) {
    return <MessageUnlinkChainAccountDetails message={encodeObject?.value} />;
  }
  return (
    <MessageUnknownDetails
      typeUrl={msg.typeUrl}
      value={
        msg.type === MessageType.DirectMsg_MSY_TYP
          ? toHex(msg.directMessage.value)
          : JSON.stringify(aminoMessage?.value ?? encodeObject?.value)
      }
    />
  );
};

enum MessageType {
  EncodeObject_MSG_TYP,
  DirectMsg_MSY_TYP,
  AminoMsg_MSG_TYP,
}

type EncodeObjectMessage = {
  type: MessageType.EncodeObject_MSG_TYP;
  typeUrl: string;
  encodeObject: EncodeObject;
};

type AminoMessage = {
  type: MessageType.AminoMsg_MSG_TYP;
  typeUrl: string;
  aminoMsg: AminoMsg;
};

type DirectMessage = {
  type: MessageType.DirectMsg_MSY_TYP;
  typeUrl: string;
  directMessage: Any;
};

type TypedMessage = EncodeObjectMessage | AminoMessage | DirectMessage;

function resolveMessageType(msg: EncodeObject | Any | AminoMsg): TypedMessage {
  const type = getMessageType(msg);
  const typeUrl = getMessageTypeUrl(type, msg);

  switch (type) {
    case MessageType.DirectMsg_MSY_TYP:
      return {
        type,
        typeUrl,
        directMessage: msg as Any,
      };

    case MessageType.EncodeObject_MSG_TYP:
      return {
        type,
        typeUrl,
        encodeObject: msg as EncodeObject,
      };

    case MessageType.AminoMsg_MSG_TYP:
      return {
        type,
        typeUrl,
        aminoMsg: msg as AminoMsg,
      };
    default:
      return {
        type,
        typeUrl,
        directMessage: msg as Any,
      };
  }
}

function getMessageType(msg: EncodeObject | Any | AminoMsg): MessageType {
  if (msg.value.constructor === Uint8Array) {
    return MessageType.DirectMsg_MSY_TYP;
  }
  if ((msg as EncodeObject).typeUrl !== undefined) {
    return MessageType.EncodeObject_MSG_TYP;
  }
  return MessageType.AminoMsg_MSG_TYP;
}

function getMessageTypeUrl(msgType: MessageType, msg: EncodeObject | Any | AminoMsg): string {
  switch (msgType) {
    case MessageType.DirectMsg_MSY_TYP:
      return (msg as Any).typeUrl;
    case MessageType.EncodeObject_MSG_TYP:
      return (msg as EncodeObject).typeUrl;
    case MessageType.AminoMsg_MSG_TYP:
      return aminoMsgTypeToTypeUrl((msg as AminoMsg).type);
    default:
      return '';
  }
}

function aminoMsgTypeToTypeUrl(aminoType: string): string {
  switch (aminoType) {
    case 'cosmos-sdk/MsgSend':
      return '/cosmos.bank.v1beta1.MsgSend';

    case 'cosmos-sdk/MsgMultiSend':
      return '/cosmos.bank.v1beta1.MsgMultiSend';

    case 'cosmos-sdk/MsgWithdrawDelegationReward':
      return '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';

    case 'cosmos-sdk/MsgVote':
      return '/cosmos.gov.v1beta1.MsgVote';

    case 'cosmos-sdk/MsgDelegate':
      return '/cosmos.staking.v1beta1.MsgDelegate';

    case 'desmos/MsgSaveProfile':
      return '/desmos.profiles.v3.MsgSaveProfile';

    case 'desmos/MsgLinkChainAccount':
      return '/desmos.profiles.v3.MsgLinkChainAccount';

    case 'desmos/MsgUnlinkChainAccount':
      return '/desmos.profiles.v3.MsgUnlinkChainAccount';

    default:
      return aminoType;
  }
}
