import {
  MsgAcceptDTagTransferRequestTypeUrl,
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionTypeUrl,
  MsgAddReasonTypeUrl,
  MsgAddRegisteredReactionTypeUrl,
  MsgAddUserToUserGroupTypeUrl,
  MsgAnswerPollTypeUrl,
  MsgBeginRedelegateTypeUrl,
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
  MsgUndelegateTypeUrl,
  MsgUnlinkApplicationTypeUrl,
  MsgUnlinkChainAccountTypeUrl,
  MsgVoteTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
} from '@desmoslabs/desmjs';
import { MsgExecTypeUrl } from 'types/cosmos';
import MsgExecDetails from 'components/Messages/authz/MsgExecDetails';
import MsgSendComponentDetails from './bank/MsgSendDetails';
import MsgMultiSendComponentDetails from './bank/MsgMultiSendDetails';
import MsgVoteComponentDetails from './gov/MsgVoteDetails';
import MsgDelegateComponentDetails from './staking/MsgDelegateDetails';
import MsgWithdrawDelegatorRewardsComponentDetails from './distribution/MsgWithdrawDelegatorRewardsDetails';
import MsgBeginRedelegateComponentDetails from './staking/MsgBeginRedelegateDetails';
import MsgUndelegateComponentDetails from './staking/MsgUndelegateDetails';
import MsgSaveProfileComponentDetails from './profiles/MsgSaveProfileDetails';
import MsgLinkChainAccountComponentDetails from './profiles/MsgLinkChainAccountDetails';
import MsgUnlinkChainAccountComponentDetails from './profiles/MsgUnlinkChainAccountDetails';
import MsgDeleteProfileComponentDetails from './profiles/MsgDeleteProfileDetails';
import MsgRequestDtagTransferComponentDetails from './profiles/MsgRequestDtagTransferDetails';
import MsgAcceptDtagTransferComponentDetails from './profiles/MsgAcceptDtagTransferDetails';
import MsgRefuseDtagTransferRequestComponentDetails from './profiles/MsgRefuseDTagTransferRequestDetails';
import MsgLinkApplicationComponentDetails from './profiles/MsgLinkApplicationDetails';
import MsgUnlinkApplicationComponentDetails from './profiles/MsgUnlinkApplicationDetails';
import MsgGrantAllowanceComponentDetails from './feegrant/MsgGrantAllowanceDetails';
import MsgRevokeAllowanceComponentDetails from './feegrant/MsgRevokeAllowanceDetails';
import MsgCreateSubspaceComponentDetails from './subspaces/MsgCreateSubspaceDetails';
import MsgCreateSectionComponentDetails from './subspaces/MsgCreateSectionDetails';
import MsgEditSectionComponentDetails from './subspaces/MsgEditSectionDetails';
import MsgMoveSectionComponentDetails from './subspaces/MsgMoveSectionDetails';
import MsgDeleteSectionComponentDetails from './subspaces/MsgDeleteSectionDetails';
import MsgCreateUserGroupComponentDetails from './subspaces/MsgCreateUserGroupDetails';
import MsgEditUserGroupComponentDetails from './subspaces/MsgEditUserGroupDetails';
import MsgMoveUserGroupComponentDetails from './subspaces/MsgMoveUserGroupDetails';
import MsgAddUserToUserGroupComponentDetails from './subspaces/MsgAddUserToUserGroupDetails';
import MsgRemoveUserFromUserGroupComponentDetails from './subspaces/MsgRemoveUserFromUserGroupDetails';
import MsgRemovePostAttachmentComponentDetails from './posts/MsgRemovePostAttachmentDetails';
import MsgAddReactionComponentDetails from './reactions/MsgAddReactionDetails';
import MsgSetReactionsParamsComponentDetails from './reactions/MsgSetReactionsParamsDetails';
import MsgCreateReportComponentDetails from './reports/MsgCreateReportDetails';
import MsgAddReasonComponentDetails from './reports/MsgAddReasonDetails';
import { MessageDetailsComponent } from './BaseMessage';
import MsgCancelDtagTransferRequestComponentDetails from './profiles/MsgCancelDTagTransferRequestDetails';
import MsgCreateRelationshipComponentDetails from './relationships/MsgCreateRelationshipDetails';
import MsgDeleteRelationshipComponentDetails from './relationships/MsgDeleteRelationshipDetails';
import MsgBlockUserComponentDetails from './relationships/MsgBlockUserDetails';
import MsgUnblockUserComponentDetails from './relationships/MsgUnblockUserDetails';
import MsgEditSubspaceComponentDetails from './subspaces/MsgEditSubspaceDetails';
import MsgDeleteSubspaceComponentDetails from './subspaces/MsgDeleteSubspaceDetails';
import MsgSetUserGroupPermissionsComponentDetails from './subspaces/MsgSetUserGroupPermissionsDetails';
import MsgDeleteUserGroupComponentDetails from './subspaces/MsgDeleteUserGroupDetails';
import MsgSetUserPermissionsComponentDetails from './subspaces/MsgSetUserPermissionsDetails';
import MsgGrantComponentDetails from './authz/MsgGrantDetails';
import MsgRevokeComponentDetails from './authz/MsgRevokeDetails';
import MsgCreatePostComponentDetails from './posts/MsgCreatePostDetails';
import MsgDeletePostComponentDetails from './posts/MsgDeletePostDetails';
import MsgEditPostComponentDetails from './posts/MsgEditPostDetails';
import MsgAddPostAttachmentComponentDetails from './posts/MsgAddPostAttachmentDetails';
import MsgAnswerPollComponentDetails from './posts/MsgAnswerPollDetails';
import MsgRemoveReactionComponentDetails from './reactions/MsgRemoveReactionDetails';
import MsgAddRegisteredReactionComponentDetails from './reactions/MsgAddRegisteredReactionDetails';
import MsgEditRegisteredReactionComponentDetails from './reactions/MsgEditRegisteredReactionDetails';
import MsgRemoveRegisteredReactionComponentDetails from './reactions/MsgRemoveRegisteredReactionDetails';
import MsgDeleteReportComponentDetails from './reports/MsgDeleteReportDetails';
import MsgSupportStandardReasonComponentDetails from './reports/MsgSupportStandardReasonDetails';
import MsgRemoveReasonComponentDetails from './reports/MsgRemoveReasonDetails';

export const messageDetailsComponents: Record<string, MessageDetailsComponent<any>> = {
  // x/authz
  [MsgGrantTypeUrl]: MsgGrantComponentDetails,
  [MsgExecTypeUrl]: MsgExecDetails,
  [MsgRevokeTypeUrl]: MsgRevokeComponentDetails,

  // x/bank
  [MsgSendTypeUrl]: MsgSendComponentDetails,
  [MsgMultiSendTypeUrl]: MsgMultiSendComponentDetails,

  // x/distribution
  [MsgWithdrawDelegatorRewardTypeUrl]: MsgWithdrawDelegatorRewardsComponentDetails,

  // x/gov
  [MsgVoteTypeUrl]: MsgVoteComponentDetails,

  // x/staking
  [MsgDelegateTypeUrl]: MsgDelegateComponentDetails,
  [MsgBeginRedelegateTypeUrl]: MsgBeginRedelegateComponentDetails,
  [MsgUndelegateTypeUrl]: MsgUndelegateComponentDetails,

  // x/feegrant
  [MsgGrantAllowanceTypeUrl]: MsgGrantAllowanceComponentDetails,
  [MsgRevokeAllowanceTypeUrl]: MsgRevokeAllowanceComponentDetails,

  // x/profiles
  [MsgSaveProfileTypeUrl]: MsgSaveProfileComponentDetails,
  [MsgDeleteProfileTypeUrl]: MsgDeleteProfileComponentDetails,
  [MsgRequestDTagTransferTypeUrl]: MsgRequestDtagTransferComponentDetails,
  [MsgCancelDTagTransferRequestTypeUrl]: MsgCancelDtagTransferRequestComponentDetails,
  [MsgAcceptDTagTransferRequestTypeUrl]: MsgAcceptDtagTransferComponentDetails,
  [MsgRefuseDTagTransferRequestTypeUrl]: MsgRefuseDtagTransferRequestComponentDetails,
  [MsgLinkChainAccountTypeUrl]: MsgLinkChainAccountComponentDetails,
  [MsgUnlinkChainAccountTypeUrl]: MsgUnlinkChainAccountComponentDetails,
  [MsgLinkApplicationTypeUrl]: MsgLinkApplicationComponentDetails,
  [MsgUnlinkApplicationTypeUrl]: MsgUnlinkApplicationComponentDetails,

  // x/relationships
  [MsgCreateRelationshipTypeUrl]: MsgCreateRelationshipComponentDetails,
  [MsgDeleteRelationshipTypeUrl]: MsgDeleteRelationshipComponentDetails,
  [MsgBlockUserTypeUrl]: MsgBlockUserComponentDetails,
  [MsgUnblockUserTypeUrl]: MsgUnblockUserComponentDetails,

  // x/subspaces
  [MsgCreateSubspaceTypeUrl]: MsgCreateSubspaceComponentDetails,
  [MsgEditSubspaceTypeUrl]: MsgEditSubspaceComponentDetails,
  [MsgDeleteSubspaceTypeUrl]: MsgDeleteSubspaceComponentDetails,
  [MsgCreateSectionTypeUrl]: MsgCreateSectionComponentDetails,
  [MsgEditSectionTypeUrl]: MsgEditSectionComponentDetails,
  [MsgMoveSectionTypeUrl]: MsgMoveSectionComponentDetails,
  [MsgDeleteSectionTypeUrl]: MsgDeleteSectionComponentDetails,
  [MsgCreateUserGroupTypeUrl]: MsgCreateUserGroupComponentDetails,
  [MsgEditUserGroupTypeUrl]: MsgEditUserGroupComponentDetails,
  [MsgMoveUserGroupTypeUrl]: MsgMoveUserGroupComponentDetails,
  [MsgSetUserGroupPermissionsTypeUrl]: MsgSetUserGroupPermissionsComponentDetails,
  [MsgDeleteUserGroupTypeUrl]: MsgDeleteUserGroupComponentDetails,
  [MsgAddUserToUserGroupTypeUrl]: MsgAddUserToUserGroupComponentDetails,
  [MsgRemoveUserFromUserGroupTypeUrl]: MsgRemoveUserFromUserGroupComponentDetails,
  [MsgSetUserPermissionsTypeUrl]: MsgSetUserPermissionsComponentDetails,

  // x/posts
  [MsgCreatePostTypeUrl]: MsgCreatePostComponentDetails,
  [MsgEditPostTypeUrl]: MsgEditPostComponentDetails,
  [MsgDeletePostTypeUrl]: MsgDeletePostComponentDetails,
  [MsgAddPostAttachmentTypeUrl]: MsgAddPostAttachmentComponentDetails,
  [MsgRemovePostAttachmentTypeUrl]: MsgRemovePostAttachmentComponentDetails,
  [MsgAnswerPollTypeUrl]: MsgAnswerPollComponentDetails,

  // x/reactions
  [MsgAddReactionTypeUrl]: MsgAddReactionComponentDetails,
  [MsgRemoveReactionTypeUrl]: MsgRemoveReactionComponentDetails,
  [MsgAddRegisteredReactionTypeUrl]: MsgAddRegisteredReactionComponentDetails,
  [MsgEditRegisteredReactionTypeUrl]: MsgEditRegisteredReactionComponentDetails,
  [MsgRemoveRegisteredReactionTypeUrl]: MsgRemoveRegisteredReactionComponentDetails,
  [MsgSetReactionsParamsTypeUrl]: MsgSetReactionsParamsComponentDetails,

  // x/reports
  [MsgCreateReportTypeUrl]: MsgCreateReportComponentDetails,
  [MsgDeleteReportTypeUrl]: MsgDeleteReportComponentDetails,
  [MsgSupportStandardReasonTypeUrl]: MsgSupportStandardReasonComponentDetails,
  [MsgAddReasonTypeUrl]: MsgAddReasonComponentDetails,
  [MsgRemoveReasonTypeUrl]: MsgRemoveReasonComponentDetails,
};
