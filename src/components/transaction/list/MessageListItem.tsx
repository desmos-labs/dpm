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
import { MessageDelegateListItem } from '../messages/staking/MessageDelegateListItem';
import { MessageLinkChainAccountListItem } from '../messages/profiles/MessageLinkChainAccountListItem';
import { MessageMultiSendListItem } from '../messages/bank/MessageMultiSendListItem';
import { MessageSaveProfileListItem } from '../messages/profiles/MessageSaveProfileListItem';
import { MessageSendListItem } from '../messages/bank/MessageSendListItem';
import { MessageUnlinkChainAccountListItem } from '../messages/profiles/MessageUnlinkChainAccountListItem';
import { MessageVoteListItem } from '../messages/gov/MessageVoteListItem';
import { MessageWithdrawDelegatorRewardListItem } from '../messages/staking/MessageWithdrawDelegatorRewardListItem';
import { MessageUnknownListItem } from '../messages/unknown/MessageUnknownListItem';

export type Props = {
  encodeObject: EncodeObject;
  date: Date;
};

export const MessageListItem: React.FC<Props> = ({ encodeObject, date }) => {
  switch (encodeObject.typeUrl) {
    case MsgTypes.MsgSend: {
      const message = (encodeObject as MsgSendEncodeObject).value;
      return <MessageSendListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgMultiSend: {
      const message = (encodeObject as MsgMultiSendEncodeObject).value;
      return <MessageMultiSendListItem message={message} date={date} />;
    }

    case MsgTypes.MsgSaveProfile: {
      const message = (encodeObject as MsgSaveProfileEncodeObject).value;
      return <MessageSaveProfileListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgVote: {
      const message = (encodeObject as MsgVoteEncodeObject).value;
      return <MessageVoteListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgDelegate: {
      const message = (encodeObject as MsgDelegateEncodeObject).value;
      return <MessageDelegateListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgWithdrawDelegatorReward: {
      const message = (encodeObject as MsgWithdrawDelegatorRewardEncodeObject).value;
      return <MessageWithdrawDelegatorRewardListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgLinkChainAccount: {
      const message = (encodeObject as MsgLinkChainAccountEncodeObject).value;
      return <MessageLinkChainAccountListItem message={message} date={date} />;
    }

    case MsgTypes.MsgUnlinkChainAccount: {
      const message = (encodeObject as MsgUnlinkChainAccountEncodeObject).value;
      return <MessageUnlinkChainAccountListItem message={message} date={date} />;
    }

    default:
      return <MessageUnknownListItem message={encodeObject} date={date} />;
  }
};
