import { AminoMsg } from '@cosmjs/amino/build/signdoc';
import { toHex } from '@cosmjs/encoding';
import { EncodeObject } from '@cosmjs/proto-signing';
import {
  MsgLinkChainAccount,
  MsgUnlinkChainAccount,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import { MsgSaveProfile } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import React, { useMemo } from 'react';
import MsgTypes from '../../types/msgtypes';
import { MessageDelegate } from './MessageDelegate';
import { MessageLinkChainAccount } from './MessageLinkChainAccount';
import { MessageMultiSend } from './MessageMultiSend';
import { MessageSend } from './MessageSend';
import { MessageUnlinkChainAccount } from './MessageUnlinkChainAccount';
import { MessageVote } from './MessageVote';
import { MessageWithdrawDelegatorRewards } from './MessageWithdrawDelegatorRewards';
import { SaveProfileMessage } from './SaveProfileMessage';
import { UnknownTxMessage } from './UnknownTxMessage';

export type Props = {
  /**
   * The message to display.
   */
  message: Any | EncodeObject | AminoMsg;
};

export const TxMessage: React.FC<Props> = ({ message }) => {
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

  if (msg.typeUrl === MsgTypes.MsgSaveProfile || msg.typeUrl === MsgTypes.MsgSaveProfileV3) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const msgSaveProfile = MsgSaveProfile.decode(msg.directMessage.value);
      return <SaveProfileMessage protobufObject={msgSaveProfile} />;
    }
    return (
      <SaveProfileMessage encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />
    );
  }
  if (msg.typeUrl === MsgTypes.MsgSend) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgSend.decode(msg.directMessage.value);
      return <MessageSend protobufMessage={decodedMessage} />;
    }
    return <MessageSend encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgMultiSend) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgMultiSend.decode(msg.directMessage.value);
      return <MessageMultiSend protobufMessage={decodedMessage} />;
    }
    return (
      <MessageMultiSend encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />
    );
  }
  if (msg.typeUrl === MsgTypes.MsgVote) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgVote.decode(msg.directMessage.value);
      return <MessageVote protobufMessage={decodedMessage} />;
    }
    return <MessageVote encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgDelegate) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgDelegate.decode(msg.directMessage.value);
      return <MessageDelegate protobufMessage={decodedMessage} />;
    }
    return (
      <MessageDelegate encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />
    );
  }
  if (msg.typeUrl === MsgTypes.MsgWithdrawDelegatorReward) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgWithdrawDelegatorReward.decode(msg.directMessage.value);
      return <MessageWithdrawDelegatorRewards protobufMessage={decodedMessage} />;
    }
    return (
      <MessageWithdrawDelegatorRewards
        encodeObject={encodeObject?.value}
        aminoMessage={aminoMessage?.value}
      />
    );
  }
  if (
    msg.typeUrl === MsgTypes.MsgLinkChainAccount ||
    msg.typeUrl === MsgTypes.MsgLinkChainAccountV3
  ) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgLinkChainAccount.decode(msg.directMessage.value);
      return <MessageLinkChainAccount protobufMessage={decodedMessage} />;
    }
    return (
      <MessageLinkChainAccount
        encodeObject={encodeObject?.value}
        aminoMessage={aminoMessage?.value}
      />
    );
  }
  if (
    msg.typeUrl === MsgTypes.MsgUnlinkChainAccount ||
    msg.typeUrl === MsgTypes.MsgUnlinkChainAccountV3
  ) {
    if (msg.type === MessageType.DirectMsg_MSY_TYP) {
      const decodedMessage = MsgUnlinkChainAccount.decode(msg.directMessage.value);
      return <MessageUnlinkChainAccount protobufMessage={decodedMessage} />;
    }
    return (
      <MessageUnlinkChainAccount
        encodeObject={encodeObject?.value}
        aminoMessage={aminoMessage?.value}
      />
    );
  }
  return (
    <UnknownTxMessage
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
