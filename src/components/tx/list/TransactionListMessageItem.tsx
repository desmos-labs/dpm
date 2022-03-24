import { EncodeObject } from '@cosmjs/proto-signing';
import {
  MsgDelegateEncodeObject,
  MsgLinkChainAccountEncodeObject,
  MsgSaveProfileEncodeObject,
  MsgSendEncodeObject,
  MsgUnlinkChainAccountEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@desmoslabs/sdk-core';
import React from 'react';
import { MsgMultiSendEncodeObject } from '../../../types/encodeobject';
import { MsgTypes } from '../../../types/msgtypes';
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
      return (
        <MessageLinkChainAccountListItem
          encodeObject={encodeObject as MsgLinkChainAccountEncodeObject}
          date={date}
        />
      );

    case MsgTypes.MsgUnlinkChainAccount:
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
