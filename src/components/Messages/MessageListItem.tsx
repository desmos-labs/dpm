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
import { MsgMultiSendEncodeObject } from 'types/encodeobject';
import MsgTypes from 'types/msgtypes';
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

export const MessageListItem: React.FC<Props> = ({ encodeObject, date }) => {
  switch (encodeObject.typeUrl) {
    case MsgTypes.MsgSend: {
      const message = (encodeObject as MsgSendEncodeObject).value;
      return <MsgSend.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgMultiSend: {
      const message = (encodeObject as MsgMultiSendEncodeObject).value;
      return <MsgMultiSend.ListItem message={message} date={date} />;
    }

    case MsgTypes.MsgSaveProfile: {
      const message = (encodeObject as MsgSaveProfileEncodeObject).value;
      return <MsgSaveProfile.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgVote: {
      const message = (encodeObject as MsgVoteEncodeObject).value;
      return <MsgVote.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgDelegate: {
      const message = (encodeObject as MsgDelegateEncodeObject).value;
      return <MsgDelegate.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgWithdrawDelegatorReward: {
      const message = (encodeObject as MsgWithdrawDelegatorRewardEncodeObject).value;
      return <MsgWithdrawDelegatorRewards.ListItem message={message} date={date}/>;
    }

    case MsgTypes.MsgLinkChainAccount: {
      const message = (encodeObject as MsgLinkChainAccountEncodeObject).value;
      return <MsgLinkChainAccount.ListItem message={message} date={date} />;
    }

    case MsgTypes.MsgUnlinkChainAccount: {
      const message = (encodeObject as MsgUnlinkChainAccountEncodeObject).value;
      return <MsgUnlinkChainAccount.ListItem message={message} date={date} />;
    }

    default:
      return <MsgUnknown.ListItem message={encodeObject} date={date} />;
  }
};
