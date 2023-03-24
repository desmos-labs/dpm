import {
  MsgAcceptDTagTransferRequestTypeUrl,
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionTypeUrl,
  MsgAddRegisteredReactionTypeUrl,
  MsgAddReasonTypeUrl,
  MsgAddUserToUserGroupTypeUrl,
  MsgAnswerPollTypeUrl,
  MsgBlockUserTypeUrl,
  MsgCancelDTagTransferRequestTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgCreateSectionTypeUrl,
  MsgCreateSubspaceTypeUrl,
  MsgCreateUserGroupTypeUrl,
  MsgDelegateTypeUrl,
  MsgDeletePostTypeUrl,
  MsgDeleteProfileTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgDeleteReportTypeUrl,
  MsgDeleteSectionTypeUrl,
  MsgDeleteSubspaceTypeUrl,
  MsgDeleteUserGroupTypeUrl,
  MsgEditPostTypeUrl,
  MsgEditRegisteredReactionTypeUrl,
  MsgEditSectionTypeUrl,
  MsgEditSubspaceTypeUrl,
  MsgEditUserGroupTypeUrl,
  MsgGrantAllowanceTypeUrl,
  MsgGrantTypeUrl,
  MsgLinkApplicationTypeUrl,
  MsgLinkChainAccountTypeUrl,
  MsgMoveSectionTypeUrl,
  MsgMoveUserGroupTypeUrl,
  MsgMultiSendTypeUrl,
  MsgRefuseDTagTransferRequestTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgRemoveRegisteredReactionTypeUrl,
  MsgRemoveUserFromUserGroupTypeUrl,
  MsgRequestDTagTransferTypeUrl,
  MsgRevokeAllowanceTypeUrl,
  MsgRevokeTypeUrl,
  MsgSaveProfileTypeUrl,
  MsgSendTypeUrl,
  MsgSetReactionsParamsTypeUrl,
  MsgSetUserGroupPermissionsTypeUrl,
  MsgSetUserPermissionsTypeUrl,
  MsgSupportStandardReasonTypeUrl,
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
import MsgGrantAllowanceComponents from 'components/Messages/MsgGrantAllowance';
import MsgRevokeAllowanceComponents from 'components/Messages/MsgRevokeAllowance';
import MsgCreateSubspaceComponents from 'components/Messages/subspaces/MsgCreateSubspace';
import MsgCreateSectionComponents from 'components/Messages/subspaces/MsgCreateSection';
import MsgEditSectionComponents from 'components/Messages/subspaces/MsgEditSection';
import MsgMoveSectionComponents from 'components/Messages/subspaces/MsgMoveSection';
import MsgDeleteSectionComponents from 'components/Messages/subspaces/MsgDeleteSection';
import MsgCreateUserGroupComponents from 'components/Messages/subspaces/MsgCreateUserGroup';
import MsgEditUserGroupComponents from 'components/Messages/subspaces/MsgEditUserGroup';
import MsgMoveUserGroupComponents from 'components/Messages/subspaces/MsgMoveUserGroup';
import MsgAddUserToUserGroupComponents from 'components/Messages/subspaces/MsgAddUserToUserGroup';
import MsgRemoveUserFromUserGroupComponents from 'components/Messages/subspaces/MsgRemoveUserFromUserGroup';
import MsgRemovePostAttachmentComponents from 'components/Messages/posts/MsgRemovePostAttachment';
import MsgAddReactionComponents from 'components/Messages/reactions/MsgAddReaction';
import MsgSetReactionsParamsComponents from 'components/Messages/reactions/MsgSetReactionsParams';
import MsgCreateReportComponents from 'components/Messages/reports/MsgCreateReport';
import MsgAddReasonComponents from 'components/Messages/reports/MsgAddReason';
import { MessageComponents } from './BaseMessage';
import MsgCancelDtagTransferRequestComponents from './MsgCancelDTagTransferRequest';
import MsgCreateRelationshipComponents from './MsgCreateRelationship';
import MsgDeleteRelationshipComponents from './MsgDeleteRelationship';
import MsgBlockUserComponents from './MsgBlockUser';
import MsgUnblockUserComponents from './MsgUnblockUser';
import MsgEditSubspaceComponents from './subspaces/MsgEditSubspace';
import MsgDeleteSubspaceComponents from './subspaces/MsgDeleteSubspace';
import MsgSetUserGroupPermissionsComponents from './subspaces/MsgSetUserGroupPermissions';
import MsgDeleteUserGroupComponents from './subspaces/MsgDeleteUserGroup';
import MsgSetUserPermissionsComponents from './subspaces/MsgSetUserPermissions';
import MsgGrantComponents from './MsgGrant';
import MsgRevokeComponents from './MsgRevoke';
import MsgCreatePostComponents from './posts/MsgCreatePost';
import MsgDeletePostComponents from './posts/MsgDeletePost';
import MsgEditPostComponents from './posts/MsgEditPost';
import MsgAddPostAttachmentComponents from './posts/MsgAddPostAttachment';
import MsgAnswerPollComponents from './posts/MsgAnswerPoll';
import MsgRemoveReactionComponents from './reactions/MsgRemoveReaction';
import MsgAddRegisteredReactionComponents from './reactions/MsgAddRegisteredReaction';
import MsgEditRegisteredReactionComponents from './reactions/MsgEditRegisteredReaction';
import MsgRemoveRegisteredReactionComponents from './reactions/MsgRemoveRegisteredReaction';
import MsgDeleteReportComponents from './reports/MsgDeleteReport';
import MsgSupportStandardReasonComponents from './reports/MsgSupportStandardReason';

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

  // x/feegrant
  [MsgGrantAllowanceTypeUrl]: MsgGrantAllowanceComponents,
  [MsgRevokeAllowanceTypeUrl]: MsgRevokeAllowanceComponents,

  // x/authz
  [MsgGrantTypeUrl]: MsgGrantComponents,
  [MsgRevokeTypeUrl]: MsgRevokeComponents,

  // x/subspaces
  [MsgCreateSubspaceTypeUrl]: MsgCreateSubspaceComponents,
  [MsgEditSubspaceTypeUrl]: MsgEditSubspaceComponents,
  [MsgDeleteSubspaceTypeUrl]: MsgDeleteSubspaceComponents,
  [MsgCreateSectionTypeUrl]: MsgCreateSectionComponents,
  [MsgEditSectionTypeUrl]: MsgEditSectionComponents,
  [MsgMoveSectionTypeUrl]: MsgMoveSectionComponents,
  [MsgDeleteSectionTypeUrl]: MsgDeleteSectionComponents,
  [MsgCreateUserGroupTypeUrl]: MsgCreateUserGroupComponents,
  [MsgEditUserGroupTypeUrl]: MsgEditUserGroupComponents,
  [MsgMoveUserGroupTypeUrl]: MsgMoveUserGroupComponents,
  [MsgSetUserGroupPermissionsTypeUrl]: MsgSetUserGroupPermissionsComponents,
  [MsgDeleteUserGroupTypeUrl]: MsgDeleteUserGroupComponents,
  [MsgAddUserToUserGroupTypeUrl]: MsgAddUserToUserGroupComponents,
  [MsgRemoveUserFromUserGroupTypeUrl]: MsgRemoveUserFromUserGroupComponents,
  [MsgSetUserPermissionsTypeUrl]: MsgSetUserPermissionsComponents,

  // x/posts
  [MsgCreatePostTypeUrl]: MsgCreatePostComponents,
  [MsgEditPostTypeUrl]: MsgEditPostComponents,
  [MsgDeletePostTypeUrl]: MsgDeletePostComponents,
  [MsgAddPostAttachmentTypeUrl]: MsgAddPostAttachmentComponents,
  [MsgRemovePostAttachmentTypeUrl]: MsgRemovePostAttachmentComponents,
  [MsgAnswerPollTypeUrl]: MsgAnswerPollComponents,

  // x/reactions
  [MsgAddReactionTypeUrl]: MsgAddReactionComponents,
  [MsgRemoveReactionTypeUrl]: MsgRemoveReactionComponents,
  [MsgAddRegisteredReactionTypeUrl]: MsgAddRegisteredReactionComponents,
  [MsgEditRegisteredReactionTypeUrl]: MsgEditRegisteredReactionComponents,
  [MsgRemoveRegisteredReactionTypeUrl]: MsgRemoveRegisteredReactionComponents,
  [MsgSetReactionsParamsTypeUrl]: MsgSetReactionsParamsComponents,

  // x/reports
  [MsgCreateReportTypeUrl]: MsgCreateReportComponents,
  [MsgDeleteReportTypeUrl]: MsgDeleteReportComponents,
  [MsgSupportStandardReasonTypeUrl]: MsgSupportStandardReasonComponents,
  [MsgAddReasonTypeUrl]: MsgAddReasonComponents,
};
