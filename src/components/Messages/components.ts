import {
  Authz,
  Bank,
  Distribution,
  Feegrant,
  Gov,
  Posts,
  Profiles,
  Reactions,
  Relationships,
  Reports,
  Staking,
  Subspaces,
  TokenFactory,
} from '@desmoslabs/desmjs';
import {
  MsgExecTypeUrl,
  MsgSoftwareUpgradeTypeUrl,
  MsgTransferTypeUrl,
  MsgUpdateStakingModuleParamsTypeUrl,
  SoftwareUpgradeProposalTypeUrl,
} from 'types/cosmos';
import MsgExecDetails from 'components/Messages/authz/MsgExecDetails';
import MsgSubmitProposalDetails from 'components/Messages/gov/MsgSubmitProposalDetails';
import MsgDepositDetails from 'components/Messages/gov/MsgDepositDetails';
import MsgTransferDetails from 'components/Messages/ibc/MsgTransferDetails';
import MsgCreateValidatorDetails from 'components/Messages/staking/MsgCreateValidatorDetails';
import MsgEditValidatorDetails from 'components/Messages/staking/MsgEditValidatorDetails';
import MsgUpdateStakingModuleParams from 'components/Messages/staking/MsgUpdateParams';
import SoftwareUpgradeProposal from 'components/Messages/upgrade/v1beta1/SoftwareUpgradeProposal';
import MsgSoftwareUpgrade from 'components/Messages/upgrade/v1beta1/MsgSoftwareUpgrade';
import MsgMovePostDetails from 'components/Messages/posts/MsgMovePostDetails';
import MsgRequestPostOwnerTransferDetails from 'components/Messages/posts/MsgRequestPostOwnerTransfer';
import MsgCancelPostOwnerTransferRequestDetails from 'components/Messages/posts/MsgCancelPostOwnerTransferRequest';
import MsgAcceptPostOwnerTransferRequestDetails from 'components/Messages/posts/MsgAcceptPostOwnerTransferRequest';
import MsgRefusePostOwnerTransferRequestDetails from 'components/Messages/posts/MsgRefusePostOwnerTransferRequest';
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
import MsgSetWithdrawAddressDetails from './distribution/MsgSetWithdrawAddressDetails';
import MsgWithdrawValidatorCommissionDetails from './distribution/MsgWithdrawValidatorCommissionDetails';
import MsgFundCommunityPoolDetails from './distribution/MsgFundCommunityPoolDetails';
import MsgUpdateSubspaceFeeTokensDetails from './subspaces/MsgUpdateSubspaceFeeTokensDetails';
import MsgCreateDenomDetails from './tokenfactory/MsgCreateDenomDetails';
import MsgMintDetails from './tokenfactory/MsgMintDetails';
import MsgBurnDetails from './tokenfactory/MsgBurnDetails';
import MsgSetDenomMetadataDetails from './tokenfactory/MsgSetDenomMetadataDetails';
import MsgUpdateParamsDetails from './tokenfactory/MsgUpdateParamsDetails';

export const messageDetailsComponents: Record<string, MessageDetailsComponent<any>> = {
  // x/authz
  [Authz.v1beta1.MsgGrantTypeUrl]: MsgGrantComponentDetails,
  [MsgExecTypeUrl]: MsgExecDetails,
  [Authz.v1beta1.MsgRevokeTypeUrl]: MsgRevokeComponentDetails,

  // x/bank
  [Bank.v1beta1.MsgSendTypeUrl]: MsgSendComponentDetails,
  [Bank.v1beta1.MsgMultiSendTypeUrl]: MsgMultiSendComponentDetails,

  // x/distribution
  [Distribution.v1beta1.MsgWithdrawDelegatorRewardTypeUrl]:
    MsgWithdrawDelegatorRewardsComponentDetails,
  [Distribution.v1beta1.MsgSetWithdrawAddressTypeUrl]: MsgSetWithdrawAddressDetails,
  [Distribution.v1beta1.MsgWithdrawValidatorCommissionTypeUrl]:
    MsgWithdrawValidatorCommissionDetails,
  [Distribution.v1beta1.MsgFundCommunityPoolTypeUrl]: MsgFundCommunityPoolDetails,

  // x/gov
  [Gov.v1beta1.MsgSubmitProposalTypeUrl]: MsgSubmitProposalDetails,
  [Gov.v1beta1.MsgDepositTypeUrl]: MsgDepositDetails,
  [Gov.v1beta1.MsgVoteTypeUrl]: MsgVoteComponentDetails,
  [Gov.v1.MsgSubmitProposalTypeUrl]: MsgSubmitProposalDetails,
  [Gov.v1.MsgDepositTypeUrl]: MsgDepositDetails,
  [Gov.v1.MsgVoteTypeUrl]: MsgVoteComponentDetails,

  // x/ibc
  [MsgTransferTypeUrl]: MsgTransferDetails,

  // x/staking
  [Staking.v1beta1.MsgDelegateTypeUrl]: MsgDelegateComponentDetails,
  [Staking.v1beta1.MsgBeginRedelegateTypeUrl]: MsgBeginRedelegateComponentDetails,
  [Staking.v1beta1.MsgUndelegateTypeUrl]: MsgUndelegateComponentDetails,
  [Staking.v1beta1.MsgCreateValidatorTypeUrl]: MsgCreateValidatorDetails,
  [Staking.v1beta1.MsgEditValidatorTypeUrl]: MsgEditValidatorDetails,
  [MsgUpdateStakingModuleParamsTypeUrl]: MsgUpdateStakingModuleParams,

  // x/feegrant
  [Feegrant.v1beta1.MsgGrantAllowanceTypeUrl]: MsgGrantAllowanceComponentDetails,
  [Feegrant.v1beta1.MsgRevokeAllowanceTypeUrl]: MsgRevokeAllowanceComponentDetails,

  // x/profiles
  [Profiles.v3.MsgSaveProfileTypeUrl]: MsgSaveProfileComponentDetails,
  [Profiles.v3.MsgDeleteProfileTypeUrl]: MsgDeleteProfileComponentDetails,
  [Profiles.v3.MsgRequestDTagTransferTypeUrl]: MsgRequestDtagTransferComponentDetails,
  [Profiles.v3.MsgCancelDTagTransferRequestTypeUrl]: MsgCancelDtagTransferRequestComponentDetails,
  [Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl]: MsgAcceptDtagTransferComponentDetails,
  [Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl]: MsgRefuseDtagTransferRequestComponentDetails,
  [Profiles.v3.MsgLinkChainAccountTypeUrl]: MsgLinkChainAccountComponentDetails,
  [Profiles.v3.MsgUnlinkChainAccountTypeUrl]: MsgUnlinkChainAccountComponentDetails,
  [Profiles.v3.MsgLinkApplicationTypeUrl]: MsgLinkApplicationComponentDetails,
  [Profiles.v3.MsgUnlinkApplicationTypeUrl]: MsgUnlinkApplicationComponentDetails,

  // x/relationships
  [Relationships.v1.MsgCreateRelationshipTypeUrl]: MsgCreateRelationshipComponentDetails,
  [Relationships.v1.MsgDeleteRelationshipTypeUrl]: MsgDeleteRelationshipComponentDetails,
  [Relationships.v1.MsgBlockUserTypeUrl]: MsgBlockUserComponentDetails,
  [Relationships.v1.MsgUnblockUserTypeUrl]: MsgUnblockUserComponentDetails,

  // x/subspaces
  [Subspaces.v3.MsgCreateSubspaceTypeUrl]: MsgCreateSubspaceComponentDetails,
  [Subspaces.v3.MsgEditSubspaceTypeUrl]: MsgEditSubspaceComponentDetails,
  [Subspaces.v3.MsgDeleteSubspaceTypeUrl]: MsgDeleteSubspaceComponentDetails,
  [Subspaces.v3.MsgCreateSectionTypeUrl]: MsgCreateSectionComponentDetails,
  [Subspaces.v3.MsgEditSectionTypeUrl]: MsgEditSectionComponentDetails,
  [Subspaces.v3.MsgMoveSectionTypeUrl]: MsgMoveSectionComponentDetails,
  [Subspaces.v3.MsgDeleteSectionTypeUrl]: MsgDeleteSectionComponentDetails,
  [Subspaces.v3.MsgCreateUserGroupTypeUrl]: MsgCreateUserGroupComponentDetails,
  [Subspaces.v3.MsgEditUserGroupTypeUrl]: MsgEditUserGroupComponentDetails,
  [Subspaces.v3.MsgMoveUserGroupTypeUrl]: MsgMoveUserGroupComponentDetails,
  [Subspaces.v3.MsgSetUserGroupPermissionsTypeUrl]: MsgSetUserGroupPermissionsComponentDetails,
  [Subspaces.v3.MsgDeleteUserGroupTypeUrl]: MsgDeleteUserGroupComponentDetails,
  [Subspaces.v3.MsgAddUserToUserGroupTypeUrl]: MsgAddUserToUserGroupComponentDetails,
  [Subspaces.v3.MsgRemoveUserFromUserGroupTypeUrl]: MsgRemoveUserFromUserGroupComponentDetails,
  [Subspaces.v3.MsgSetUserPermissionsTypeUrl]: MsgSetUserPermissionsComponentDetails,
  [Subspaces.v3.MsgUpdateSubspaceFeeTokensTypeUrl]: MsgUpdateSubspaceFeeTokensDetails,

  // x/posts
  [Posts.v3.MsgCreatePostTypeUrl]: MsgCreatePostComponentDetails,
  [Posts.v3.MsgEditPostTypeUrl]: MsgEditPostComponentDetails,
  [Posts.v3.MsgDeletePostTypeUrl]: MsgDeletePostComponentDetails,
  [Posts.v3.MsgAddPostAttachmentTypeUrl]: MsgAddPostAttachmentComponentDetails,
  [Posts.v3.MsgRemovePostAttachmentTypeUrl]: MsgRemovePostAttachmentComponentDetails,
  [Posts.v3.MsgAnswerPollTypeUrl]: MsgAnswerPollComponentDetails,
  [Posts.v3.MsgMovePostTypeUrl]: MsgMovePostDetails,
  [Posts.v3.MsgRequestPostOwnerTransferTypeUrl]: MsgRequestPostOwnerTransferDetails,
  [Posts.v3.MsgCancelPostOwnerTransferRequestTypeUrl]: MsgCancelPostOwnerTransferRequestDetails,
  [Posts.v3.MsgAcceptPostOwnerTransferRequestTypeUrl]: MsgAcceptPostOwnerTransferRequestDetails,
  [Posts.v3.MsgRefusePostOwnerTransferRequestTypeUrl]: MsgRefusePostOwnerTransferRequestDetails,

  // x/reactions
  [Reactions.v1.MsgAddReactionTypeUrl]: MsgAddReactionComponentDetails,
  [Reactions.v1.MsgRemoveReactionTypeUrl]: MsgRemoveReactionComponentDetails,
  [Reactions.v1.MsgAddRegisteredReactionTypeUrl]: MsgAddRegisteredReactionComponentDetails,
  [Reactions.v1.MsgEditRegisteredReactionTypeUrl]: MsgEditRegisteredReactionComponentDetails,
  [Reactions.v1.MsgRemoveRegisteredReactionTypeUrl]: MsgRemoveRegisteredReactionComponentDetails,
  [Reactions.v1.MsgSetReactionsParamsTypeUrl]: MsgSetReactionsParamsComponentDetails,

  // x/reports
  [Reports.v1.MsgCreateReportTypeUrl]: MsgCreateReportComponentDetails,
  [Reports.v1.MsgDeleteReportTypeUrl]: MsgDeleteReportComponentDetails,
  [Reports.v1.MsgSupportStandardReasonTypeUrl]: MsgSupportStandardReasonComponentDetails,
  [Reports.v1.MsgAddReasonTypeUrl]: MsgAddReasonComponentDetails,
  [Reports.v1.MsgRemoveReasonTypeUrl]: MsgRemoveReasonComponentDetails,

  // x/tokenfactory
  [TokenFactory.v1.MsgCreateDenomTypeUrl]: MsgCreateDenomDetails,
  [TokenFactory.v1.MsgMintTypeUrl]: MsgMintDetails,
  [TokenFactory.v1.MsgBurnTypeUrl]: MsgBurnDetails,
  [TokenFactory.v1.MsgSetDenomMetadataTypeUrl]: MsgSetDenomMetadataDetails,
  [TokenFactory.v1.MsgUpdateParamsTypeUrl]: MsgUpdateParamsDetails,

  // x/upgrade
  [SoftwareUpgradeProposalTypeUrl]: SoftwareUpgradeProposal,
  [MsgSoftwareUpgradeTypeUrl]: MsgSoftwareUpgrade,
};
