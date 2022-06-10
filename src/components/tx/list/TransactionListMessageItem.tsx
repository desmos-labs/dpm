import { EncodeObject } from '@cosmjs/proto-signing';
import {
  MsgLinkChainAccountEncodeObject,
  MsgSaveProfileEncodeObject,
  MsgUnlinkChainAccountEncodeObject,
} from '@desmoslabs/desmjs';
import {
  MsgDelegateEncodeObject,
  MsgSendEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@cosmjs/stargate';
import React from 'react';
import { MsgMultiSendEncodeObject } from '../../../types/encodeobject';
import MsgTypes from '../../../types/msgtypes';
import { MessageDelegateListItem } from './MessageDelegateListItem';
import { MessageLinkChainAccountListItem } from './MessageLinkChainAccountListItem';
import { MessageMultiSendListItem } from './MessageMultiSendListItem';
import { MessageSaveProfileListItem } from './MessageSaveProfileListItem';
import { MessageSendListItem } from './MessageSendListItem';
import { MessageUnlinkChainAccountListItem } from './MessageUnlinkChainAccountListItem';
import { MessageVoteListItem } from './MessageVoteListItem';
import { MessageWithdrawDelegatorRewardListItem } from './MessageWithdrawDelegatorRewardListItem';
import { UnknownMessageListItem } from './UnknownMessageListItem';

export type Props = {
  encodeObject: EncodeObject;
  date: Date;
};

export const TransactionListMessageItem: React.FC<Props> = (props) => {
  const { encodeObject, date } = props;

  switch (encodeObject.typeUrl) {
    case MsgTypes.MsgSend:
      return <MessageSendListItem encodeObject={encodeObject as MsgSendEncodeObject} date={date} />;

    case MsgTypes.MsgMultiSend:
      return (
        <MessageMultiSendListItem
          encodeObject={encodeObject as MsgMultiSendEncodeObject}
          date={date}
        />
      );

    case MsgTypes.MsgSaveProfile:
    case MsgTypes.MsgSaveProfileV2:
      return (
        <MessageSaveProfileListItem
          encodeObject={encodeObject as MsgSaveProfileEncodeObject}
          date={date}
        />
      );

    case MsgTypes.MsgVote:
      return <MessageVoteListItem encodeObject={encodeObject as MsgVoteEncodeObject} date={date} />;

    case MsgTypes.MsgDelegate:
      return (
        <MessageDelegateListItem
          encodeObject={encodeObject as MsgDelegateEncodeObject}
          date={date}
        />
      );

    case MsgTypes.MsgWithdrawDelegatorReward:
      return (
        <MessageWithdrawDelegatorRewardListItem
          encodeObject={encodeObject as MsgWithdrawDelegatorRewardEncodeObject}
          date={date}
        />
      );

    case MsgTypes.MsgLinkChainAccount:
    case MsgTypes.MsgLinkChainAccountV2:
      return (
        <MessageLinkChainAccountListItem
          encodeObject={encodeObject as MsgLinkChainAccountEncodeObject}
          date={date}
        />
      );

    case MsgTypes.MsgUnlinkChainAccount:
    case MsgTypes.MsgUnlinkChainAccountV2:
      return (
        <MessageUnlinkChainAccountListItem
          encodeObject={encodeObject as MsgUnlinkChainAccountEncodeObject}
          date={date}
        />
      );

    default:
      return <UnknownMessageListItem {...props} />;
  }
};
