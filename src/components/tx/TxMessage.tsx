import { AminoMsg } from '@cosmjs/amino/build/signdoc';
import { toHex } from '@cosmjs/encoding';
import { EncodeObject } from '@cosmjs/proto-signing';
import {
  MsgLinkChainAccount,
  MsgUnlinkChainAccount,
} from '@desmoslabs/proto/desmos/profiles/v1beta1/msgs_chain_links';
import { MsgSaveProfile } from '@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import React, { useMemo } from 'react';
import { MsgTypes } from '../../types/msgtypes';
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
  const msg: TypedMessage = useMemo(() => {
    return resolveMessageType(message);
  }, [message]);

  const encodeObject = useMemo(() => {
    if (msg.type === MessageType.EncodeObject) {
      return msg.encodeObject;
    } else {
      return undefined;
    }
  }, [msg]);

  const aminoMessage = useMemo(() => {
    if (msg.type === MessageType.AminoMsg) {
      return msg.aminoMsg;
    } else {
      return undefined;
    }
  }, [msg]);

  if (msg.typeUrl === MsgTypes.MsgSaveProfile) {
    if (msg.type === MessageType.DirectMsg) {
      const msgSaveProfile = MsgSaveProfile.decode(msg.directMessage.value);
      return <SaveProfileMessage protobufObject={msgSaveProfile} />;
    }
    return (
      <SaveProfileMessage encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />
    );
  }
  if (msg.typeUrl === MsgTypes.MsgSend) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgSend.decode(msg.directMessage.value);
      return <MessageSend protobufMessage={decodedMessage} />;
    }
    return <MessageSend encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgMultiSend) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgMultiSend.decode(msg.directMessage.value);
      return <MessageMultiSend protobufMessage={decodedMessage} />;
    }
    return (
      <MessageMultiSend encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />
    );
  }
  if (msg.typeUrl === MsgTypes.MsgVote) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgVote.decode(msg.directMessage.value);
      return <MessageVote protobufMessage={decodedMessage} />;
    }
    return <MessageVote encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />;
  }
  if (msg.typeUrl === MsgTypes.MsgDelegate) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgDelegate.decode(msg.directMessage.value);
      return <MessageDelegate protobufMessage={decodedMessage} />;
    }
    return (
      <MessageDelegate encodeObject={encodeObject?.value} aminoMessage={aminoMessage?.value} />
    );
  }
  if (msg.typeUrl === MsgTypes.MsgWithdrawDelegatorReward) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgWithdrawDelegatorReward.decode(msg.directMessage.value);
      return <MessageWithdrawDelegatorRewards protobufMessage={decodedMessage} />;
    } else {
      return (
        <MessageWithdrawDelegatorRewards
          encodeObject={encodeObject?.value}
          aminoMessage={aminoMessage?.value}
        />
      );
    }
  } else if (msg.typeUrl === MsgTypes.MsgLinkChainAccount) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgLinkChainAccount.decode(msg.directMessage.value);
      return <MessageLinkChainAccount protobufMessage={decodedMessage} />;
    } else {
      return (
        <MessageLinkChainAccount
          encodeObject={encodeObject?.value}
          aminoMessage={aminoMessage?.value}
        />
      );
    }
  } else if (msg.typeUrl === MsgTypes.MsgUnlinkChainAccount) {
    if (msg.type === MessageType.DirectMsg) {
      const decodedMessage = MsgUnlinkChainAccount.decode(msg.directMessage.value);
      return <MessageUnlinkChainAccount protobufMessage={decodedMessage} />;
    } else {
      return (
        <MessageUnlinkChainAccount
          encodeObject={encodeObject?.value}
          aminoMessage={aminoMessage?.value}
        />
      );
    }
  } else {
    return (
      <UnknownTxMessage
        typeUrl={msg.typeUrl}
        value={
          msg.type === MessageType.DirectMsg
            ? toHex(msg.directMessage.value)
            : JSON.stringify(aminoMessage?.value ?? encodeObject?.value)
        }
      />
    );
  }
};

enum MessageType {
  EncodeObject,
  DirectMsg,
  AminoMsg,
}

type EncodeObjectMessage = {
  type: MessageType.EncodeObject;
  typeUrl: string;
  encodeObject: EncodeObject;
};

type AminoMessage = {
  type: MessageType.AminoMsg;
  typeUrl: string;
  aminoMsg: AminoMsg;
};

type DirectMessage = {
  type: MessageType.DirectMsg;
  typeUrl: string;
  directMessage: Any;
};

type TypedMessage = EncodeObjectMessage | AminoMessage | DirectMessage;

function resolveMessageType(msg: EncodeObject | Any | AminoMsg): TypedMessage {
  const type = getMessageType(msg);
  const typeUrl = getMessageTypeUrl(type, msg);

  switch (type) {
    case MessageType.DirectMsg:
      return {
        type,
        typeUrl,
        directMessage: msg as Any,
      };

    case MessageType.EncodeObject:
      return {
        type,
        typeUrl,
        encodeObject: msg as EncodeObject,
      };

    case MessageType.AminoMsg:
      return {
        type,
        typeUrl,
        aminoMsg: msg as AminoMsg,
      };
  }
}

function getMessageType(msg: EncodeObject | Any | AminoMsg): MessageType {
  if (msg.value.constructor === Uint8Array) {
    return MessageType.EncodeObject;
  }
  if ((msg as EncodeObject).typeUrl !== undefined) {
    return MessageType.EncodeObject;
  }
  return MessageType.AminoMsg;
}

function getMessageTypeUrl(msgType: MessageType, msg: EncodeObject | Any | AminoMsg): string {
  switch (msgType) {
    case MessageType.DirectMsg:
      return (msg as Any).typeUrl;
    case MessageType.EncodeObject:
      return (msg as EncodeObject).typeUrl;
    case MessageType.AminoMsg:
      return aminoMsgTypeToTypeUrl((msg as AminoMsg).type);
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
      return '/desmos.profiles.v1beta1.MsgSaveProfile';

    case 'desmos/MsgLinkChainAccount':
      return '/desmos.profiles.v1beta1.MsgLinkChainAccount';

    case 'desmos/MsgUnlinkChainAccount':
      return '/desmos.profiles.v1beta1.MsgUnlinkChainAccount';

    default:
      return aminoType;
  }
}
