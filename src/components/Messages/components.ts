import {
  MsgAcceptDTagTransferRequestTypeUrl,
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionTypeUrl,
  MsgAddReasonTypeUrl,
  MsgAddRegisteredReactionTypeUrl,
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
  MsgRemoveReasonTypeUrl,
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
import MsgSendComponents from './bank/MsgSend';
import MsgMultiSendComponents from './bank/MsgMultiSend';
import MsgVoteComponents from './gov/MsgVote';
import MsgDelegateComponents from './staking/MsgDelegate';
import MsgWithdrawDelegatorRewardsComponents from './distribution/MsgWithdrawDelegatorRewards';
import MsgSaveProfileComponents from './profiles/MsgSaveProfile';
import MsgLinkChainAccountComponents from './profiles/MsgLinkChainAccount';
import MsgUnlinkChainAccountComponents from './profiles/MsgUnlinkChainAccount';
import MsgDeleteProfileComponents from './profiles/MsgDeleteProfile';
import MsgRequestDtagTransferComponents from './profiles/MsgRequestDtagTransfer';
import MsgAcceptDtagTransferComponents from './profiles/MsgAcceptDtagTransfer';
import MsgRefuseDtagTransferRequestComponents from './profiles/MsgRefuseDTagTransferRequest';
import MsgLinkApplicationComponents from './profiles/MsgLinkApplication';
import MsgUnlinkApplicationComponents from './profiles/MsgUnlinkApplication';
import MsgGrantAllowanceComponents from './feegrant/MsgGrantAllowance';
import MsgRevokeAllowanceComponents from './feegrant/MsgRevokeAllowance';
import MsgCreateSubspaceComponents from './subspaces/MsgCreateSubspace';
import MsgCreateSectionComponents from './subspaces/MsgCreateSection';
import MsgEditSectionComponents from './subspaces/MsgEditSection';
import MsgMoveSectionComponents from './subspaces/MsgMoveSection';
import MsgDeleteSectionComponents from './subspaces/MsgDeleteSection';
import MsgCreateUserGroupComponents from './subspaces/MsgCreateUserGroup';
import MsgEditUserGroupComponents from './subspaces/MsgEditUserGroup';
import MsgMoveUserGroupComponents from './subspaces/MsgMoveUserGroup';
import MsgAddUserToUserGroupComponents from './subspaces/MsgAddUserToUserGroup';
import MsgRemoveUserFromUserGroupComponents from './subspaces/MsgRemoveUserFromUserGroup';
import MsgRemovePostAttachmentComponents from './posts/MsgRemovePostAttachment';
import MsgAddReactionComponents from './reactions/MsgAddReaction';
import MsgSetReactionsParamsComponents from './reactions/MsgSetReactionsParams';
import MsgCreateReportComponents from './reports/MsgCreateReport';
import MsgAddReasonComponents from './reports/MsgAddReason';
import { MessageComponents } from './BaseMessage';
import MsgCancelDtagTransferRequestComponents from './profiles/MsgCancelDTagTransferRequest';
import MsgCreateRelationshipComponents from './relationships/MsgCreateRelationship';
import MsgDeleteRelationshipComponents from './relationships/MsgDeleteRelationship';
import MsgBlockUserComponents from './relationships/MsgBlockUser';
import MsgUnblockUserComponents from './relationships/MsgUnblockUser';
import MsgEditSubspaceComponents from './subspaces/MsgEditSubspace';
import MsgDeleteSubspaceComponents from './subspaces/MsgDeleteSubspace';
import MsgSetUserGroupPermissionsComponents from './subspaces/MsgSetUserGroupPermissions';
import MsgDeleteUserGroupComponents from './subspaces/MsgDeleteUserGroup';
import MsgSetUserPermissionsComponents from './subspaces/MsgSetUserPermissions';
import MsgGrantComponents from './authz/MsgGrant';
import MsgRevokeComponents from './authz/MsgRevoke';
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
import MsgRemoveReasonComponents from './reports/MsgRemoveReason';

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

  // x/feegrant
  [MsgGrantAllowanceTypeUrl]: MsgGrantAllowanceComponents,
  [MsgRevokeAllowanceTypeUrl]: MsgRevokeAllowanceComponents,

  // x/authz
  [MsgGrantTypeUrl]: MsgGrantComponents,
  [MsgRevokeTypeUrl]: MsgRevokeComponents,

  // x/profiles
  [MsgSaveProfileTypeUrl]: MsgSaveProfileComponents,
  [MsgDeleteProfileTypeUrl]: MsgDeleteProfileComponents,
  [MsgRequestDTagTransferTypeUrl]: MsgRequestDtagTransferComponents,
  [MsgCancelDTagTransferRequestTypeUrl]: MsgCancelDtagTransferRequestComponents,
  [MsgAcceptDTagTransferRequestTypeUrl]: MsgAcceptDtagTransferComponents,
  [MsgRefuseDTagTransferRequestTypeUrl]: MsgRefuseDtagTransferRequestComponents,
  [MsgLinkChainAccountTypeUrl]: MsgLinkChainAccountComponents,
  [MsgUnlinkChainAccountTypeUrl]: MsgUnlinkChainAccountComponents,
  [MsgLinkApplicationTypeUrl]: MsgLinkApplicationComponents,
  [MsgUnlinkApplicationTypeUrl]: MsgUnlinkApplicationComponents,

  // x/relationships
  [MsgCreateRelationshipTypeUrl]: MsgCreateRelationshipComponents,
  [MsgDeleteRelationshipTypeUrl]: MsgDeleteRelationshipComponents,
  [MsgBlockUserTypeUrl]: MsgBlockUserComponents,
  [MsgUnblockUserTypeUrl]: MsgUnblockUserComponents,

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
  [MsgRemoveReasonTypeUrl]: MsgRemoveReasonComponents,
};
