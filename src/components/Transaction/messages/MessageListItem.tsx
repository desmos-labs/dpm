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
import { MessageDelegate } from './staking/MessageDelegate';
import { MessageLinkChainAccount } from './profiles/MessageLinkChainAccount';
import { MessageMultiSend } from './bank/MessageMultiSend';
import { MessageSaveProfile } from './profiles/MessageSaveProfile';
import { MessageSend } from './bank/MessageSend';
import { MessageUnlinkChainAccount } from './profiles/MessageUnlinkChainAccount';
import { MessageVote } from './gov/MessageVote';
import { MessageWithdrawDelegatorRewards } from './staking/MessageWithdrawDelegatorRewards';
import { MessageUnknown } from './unknown/MessageUnknown';

export type Props = {
  encodeObject: EncodeObject;
  date: Date;
};

export const MessageListItem: React.FC<Props> = ({ encodeObject, date }) => {
  switch (encodeObject.typeUrl) {
    case MsgTypes.MsgSend: {
      const message = (encodeObject as MsgSendEncodeObject).value;
      return <MessageSend.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgMultiSend: {
      const message = (encodeObject as MsgMultiSendEncodeObject).value;
      return <MessageMultiSend.ListItem message={message} date={date} />;
    }

    case MsgTypes.MsgSaveProfile: {
      const message = (encodeObject as MsgSaveProfileEncodeObject).value;
      return <MessageSaveProfile.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgVote: {
      const message = (encodeObject as MsgVoteEncodeObject).value;
      return <MessageVote.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgDelegate: {
      const message = (encodeObject as MsgDelegateEncodeObject).value;
      return <MessageDelegate.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgWithdrawDelegatorReward: {
      const message = (encodeObject as MsgWithdrawDelegatorRewardEncodeObject).value;
      return <MessageWithdrawDelegatorRewards.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgLinkChainAccount: {
      const message = (encodeObject as MsgLinkChainAccountEncodeObject).value;
      return <MessageLinkChainAccount.ListItem message={message} date={date} />;
    }

    case MsgTypes.MsgUnlinkChainAccount: {
      const message = (encodeObject as MsgUnlinkChainAccountEncodeObject).value;
      return <MessageUnlinkChainAccount.ListItem message={message} date={date} />;
    }

    default:
      return <MessageUnknown.ListItem message={encodeObject} date={date} />;
  }
};
