import { EncodeObject } from '@cosmjs/proto-signing';
import {
  MsgLinkChainAccountEncodeObject,
  MsgLinkChainAccountTypeUrl,
  MsgSaveProfileEncodeObject,
  MsgSaveProfileTypeUrl,
  MsgUnlinkChainAccountEncodeObject,
  MsgUnlinkChainAccountTypeUrl,
} from '@desmoslabs/desmjs';
import {
  MsgDelegateEncodeObject,
  MsgSendEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@cosmjs/stargate';
import React from 'react';
import MsgDelegate from './MsgDelegate';
import MsgLinkChainAccount from './MsgLinkChainAccount';
import MsgMultiSend from './MsgMultiSend';
import MsgSaveProfile from './MsgSaveProfile';
import MsgSend from './MsgSend';
import MsgUnlinkChainAccount from './MsgUnlinkChainAccount';
import MsgVote from './MsgVote';
import MsgWithdrawDelegatorRewards from './MsgWithdrawDelegatorRewards';
import MsgUnknown from './MsgUnknown';

export type Props = {
  encodeObject: EncodeObject;
  date: Date;
};

const MessageListItem: React.FC<Props> = ({ encodeObject, date }) => {
  switch (encodeObject.typeUrl) {
    case '/cosmos.bank.v1beta1.MsgSend': {
      const message = (encodeObject as MsgSendEncodeObject).value;
      return <MsgSend.ListItem message={message} date={date} />;
    }

    case '/cosmos.bank.v1beta1.MsgMultiSend': {
      return <MsgMultiSend.ListItem message={encodeObject.value} date={date} />;
    }

    case MsgSaveProfileTypeUrl: {
      const message = (encodeObject as MsgSaveProfileEncodeObject).value;
      return <MsgSaveProfile.ListItem message={message} date={date} />;
    }

    case '/cosmos.gov.v1beta1.MsgVote': {
      const message = (encodeObject as MsgVoteEncodeObject).value;
      return <MsgVote.ListItem message={message} date={date} />;
    }

    case '/cosmos.staking.v1beta1.MsgDelegate': {
      const message = (encodeObject as MsgDelegateEncodeObject).value;
      return <MsgDelegate.ListItem message={message} date={date} />;
    }

    case '/cosmos.staking.v1beta1.MsgWithdrawDelegatorReward': {
      const message = (encodeObject as MsgWithdrawDelegatorRewardEncodeObject).value;
      return <MsgWithdrawDelegatorRewards.ListItem message={message} date={date} />;
    }

    case MsgLinkChainAccountTypeUrl: {
      const message = (encodeObject as MsgLinkChainAccountEncodeObject).value;
      return <MsgLinkChainAccount.ListItem message={message} date={date} />;
    }

    case MsgUnlinkChainAccountTypeUrl: {
      const message = (encodeObject as MsgUnlinkChainAccountEncodeObject).value;
      return <MsgUnlinkChainAccount.ListItem message={message} date={date} />;
    }

    default:
      return <MsgUnknown.ListItem message={encodeObject} date={date} />;
  }
};

export default MessageListItem;
