import {
  MsgAcceptDTagTransferRequestTypeUrl,
  MsgBlockUserTypeUrl,
  MsgCancelDTagTransferRequestTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgDelegateTypeUrl,
  MsgDeleteProfileTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgLinkApplicationTypeUrl,
  MsgLinkChainAccountTypeUrl,
  MsgMultiSendTypeUrl,
  MsgRefuseDTagTransferRequestTypeUrl,
  MsgRequestDTagTransferTypeUrl,
  MsgSaveProfileTypeUrl,
  MsgSendTypeUrl,
  MsgUnblockUserTypeUrl,
  MsgUnlinkApplicationTypeUrl,
  MsgUnlinkChainAccountTypeUrl,
  MsgVoteTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
} from '@desmoslabs/desmjs';
import MsgSendComponents from 'components/Messages/MsgSend';
import MsgMultiSendComponents from 'components/Messages/MsgMultiSend';
import MsgVoteComponents from 'components/Messages/MsgVote';
import MsgDelegateComponents from 'components/Messages/MsgDelegate';
import MsgWithdrawDelegatorRewardsComponents from 'components/Messages/MsgWithdrawDelegatorRewards';
import MsgSaveProfileComponents from 'components/Messages/MsgSaveProfile';
import MsgLinkChainAccountComponents from 'components/Messages/MsgLinkChainAccount';
import MsgUnlinkChainAccountComponents from 'components/Messages/MsgUnlinkChainAccount';
import MsgDeleteProfileComponents from 'components/Messages/MsgDeleteProfile';
import MsgRequestDtagTransferComponents from 'components/Messages/MsgRequestDtagTransfer';
import MsgAcceptDtagTransferComponents from 'components/Messages/MsgAcceptDtagTransfer';
import MsgRefuseDtagTransferRequestComponents from 'components/Messages/MsgRefuseDTagTransferRequest';
import MsgLinkApplicationComponents from 'components/Messages/MsgLinkApplication';
import MsgUnlinkApplicationComponents from 'components/Messages/MsgUnlinkApplication';
import { MessageComponents } from './BaseMessage';
import MsgCancelDtagTransferRequestComponents from './MsgCancelDTagTransferRequest';
import MsgCreateRelationshipComponents from './MsgCreateRelationship';
import MsgDeleteRelationshipComponents from './MsgDeleteRelationship';
import MsgBlockUserComponents from './MsgBlockUser';
import MsgUnblockUserComponents from './MsgUnblockUser';

export const messageDetailsComponents: Record<string, MessageComponents<any>> = {
  // x/bank
  [MsgSendTypeUrl]: MsgSendComponents,
  [MsgMultiSendTypeUrl]: MsgMultiSendComponents,

  // x/distribution
  [MsgWithdrawDelegatorRewardTypeUrl]: MsgWithdrawDelegatorRewardsComponents,

  // x/gov
  [MsgVoteTypeUrl]: MsgVoteComponents,

  // x/staking
  [MsgDelegateTypeUrl]: MsgDelegateComponents,

  // x/profiles
  [MsgSaveProfileTypeUrl]: MsgSaveProfileComponents,
  [MsgDeleteProfileTypeUrl]: MsgDeleteProfileComponents,
  [MsgRequestDTagTransferTypeUrl]: MsgRequestDtagTransferComponents,
  [MsgAcceptDTagTransferRequestTypeUrl]: MsgAcceptDtagTransferComponents,
  [MsgRefuseDTagTransferRequestTypeUrl]: MsgRefuseDtagTransferRequestComponents,
  [MsgCancelDTagTransferRequestTypeUrl]: MsgCancelDtagTransferRequestComponents,
  [MsgCreateRelationshipTypeUrl]: MsgCreateRelationshipComponents,
  [MsgDeleteRelationshipTypeUrl]: MsgDeleteRelationshipComponents,
  [MsgBlockUserTypeUrl]: MsgBlockUserComponents,
  [MsgUnblockUserTypeUrl]: MsgUnblockUserComponents,
  [MsgLinkApplicationTypeUrl]: MsgLinkApplicationComponents,
  [MsgUnlinkApplicationTypeUrl]: MsgUnlinkApplicationComponents,
  [MsgLinkChainAccountTypeUrl]: MsgLinkChainAccountComponents,
  [MsgUnlinkChainAccountTypeUrl]: MsgUnlinkChainAccountComponents,
};
