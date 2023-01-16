import {
  MsgLinkChainAccountTypeUrl,
  MsgSaveProfileTypeUrl,
  MsgUnlinkChainAccountTypeUrl,
} from '@desmoslabs/desmjs';
import MsgSendComponents from 'components/Messages/MsgSend';
import MsgMultiSendComponents from 'components/Messages/MsgMultiSend';
import MsgVoteComponents from 'components/Messages/MsgVote';
import MsgDelegateComponents from 'components/Messages/MsgDelegate';
import MsgWithdrawDelegatorRewardsComponents from 'components/Messages/MsgWithdrawDelegatorRewards';
import MsgSaveProfileComponents from 'components/Messages/MsgSaveProfile';
import MsgLinkChainAccountComponents from 'components/Messages/MsgLinkChainAccount';
import MsgUnlinkChainAccountComponents from 'components/Messages/MsgUnlinkChainAccount';
import { MessageComponents } from './BaseMessage';

export const messageDetailsComponents: Record<string, MessageComponents<any>> = {
  // Cosmos messages
  '/cosmos.bank.v1beta1.MsgSend': MsgSendComponents,
  '/cosmos.bank.v1beta1.MsgMultiSend': MsgMultiSendComponents,
  '/cosmos.gov.v1beta1.MsgVote': MsgVoteComponents,
  '/cosmos.staking.v1beta1.MsgDelegate': MsgDelegateComponents,
  '/cosmos.staking.v1beta1.MsgWithdrawDelegatorRewards': MsgWithdrawDelegatorRewardsComponents,

  // Desmos messages
  [MsgSaveProfileTypeUrl]: MsgSaveProfileComponents,
  [MsgLinkChainAccountTypeUrl]: MsgLinkChainAccountComponents,
  [MsgUnlinkChainAccountTypeUrl]: MsgUnlinkChainAccountComponents,
};
