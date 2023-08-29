import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import {
  iconModuleAuthz,
  iconModuleBank,
  iconModuleCosmWasm,
  iconModuleDistribution,
  iconModuleFeegrant,
  iconModuleGovernance,
  iconModulePosts,
  iconModuleProfiles,
  iconModuleReactions,
  iconModuleRelationships,
  iconModuleReports,
  iconModuleStaking,
  iconModuleSubspaces,
} from 'assets/images';

/**
 * Hook that provides an icon that represents the provided {@link EncodeObject}.
 */
const useMessageIcon = (message: EncodeObject) =>
  React.useMemo(() => {
    const messageType = message.typeUrl.split('.').pop()!;
    switch (messageType) {
      // Authz module
      case 'MsgGrant':
      case 'MsgExec':
      case 'MsgRevoke':
        return iconModuleAuthz;

      // Bank module
      case 'MsgSend':
      case 'MsgMultiSend':
        return iconModuleBank;

      // Distribution module
      case 'MsgWithdrawDelegatorReward':
      case 'MsgSetWithdrawAddress':
      case 'MsgWithdrawValidatorCommission':
      case 'MsgFundCommunityPool':
        return iconModuleDistribution;

      // Feegrant module
      case 'MsgGrantAllowance':
      case 'MsgRevokeAllowance':
        return iconModuleFeegrant;

      // Gov module
      case 'MsgSubmitProposal':
      case 'MsgDeposit':
      case 'MsgVote':
        return iconModuleGovernance;

      // IBC
      case 'MsgTransfer':
        return iconModuleBank;

      // Posts module
      case 'MsgCreatePost':
      case 'MsgEditPost':
      case 'MsgDeletePost':
      case 'MsgAddPostAttachment':
      case 'MsgRemovePostAttachment':
      case 'MsgAnswerPoll':
      case 'MsgMovePost':
      case 'MsgRequestPostOwnerTransfer':
      case 'MsgCancelPostOwnerTransferRequest':
      case 'MsgAcceptPostOwnerTransferRequest':
      case 'MsgRefusePostOwnerTransferRequest':
        return iconModulePosts;

      // Profiles module
      case 'MsgSaveProfile':
      case 'MsgDeleteProfile':
      case 'MsgRequestDTagTransfer':
      case 'MsgAcceptDTagTransferRequest':
      case 'MsgRefuseDTagTransferRequest':
      case 'MsgCancelDTagTransferRequest':
      case 'MsgLinkApplication':
      case 'MsgUnlinkApplication':
      case 'MsgLinkChainAccount':
      case 'MsgUnlinkChainAccount':
        return iconModuleProfiles;

      // Reactions
      case 'MsgAddReaction':
      case 'MsgRemoveReaction':
      case 'MsgAddRegisteredReaction':
      case 'MsgEditRegisteredReaction':
      case 'MsgRemoveRegisteredReaction':
      case 'MsgSetReactionsParams':
        return iconModuleReactions;

      // Relationships module
      case 'MsgCreateRelationship':
      case 'MsgDeleteRelationship':
      case 'MsgBlockUser':
      case 'MsgUnblockUser':
        return iconModuleRelationships;

      // Reports module
      case 'MsgCreateReport':
      case 'MsgDeleteReport':
      case 'MsgSupportStandardReason':
      case 'MsgAddReason':
      case 'MsgRemoveReason':
        return iconModuleReports;

      // Staking module
      case 'MsgCreateValidator':
      case 'MsgEditValidator':
      case 'MsgDelegate':
      case 'MsgUndelegate':
      case 'MsgBeginRedelegate':
        return iconModuleStaking;

      // Subspaces module
      case 'MsgCreateSubspace':
      case 'MsgEditSubspace':
      case 'MsgDeleteSubspace':
      case 'MsgCreateSection':
      case 'MsgEditSection':
      case 'MsgMoveSection':
      case 'MsgDeleteSection':
      case 'MsgCreateUserGroup':
      case 'MsgEditUserGroup':
      case 'MsgMoveUserGroup':
      case 'MsgSetUserGroupPermissions':
      case 'MsgDeleteUserGroup':
      case 'MsgAddUserToUserGroup':
      case 'MsgRemoveUserFromUserGroup':
      case 'MsgSetUserPermissions':
      case 'MsgUpdateSubspaceFeeTokens':
        return iconModuleSubspaces;

      // Tokenfactory module
      case 'MsgCreateDenom':
      case 'MsgMint':
      case 'MsgBurn':
      case 'MsgSetDenomMetadata':
        return iconModuleBank;

      // Unsupported message.
      default:
        return iconModuleCosmWasm;
    }
  }, [message.typeUrl]);

export default useMessageIcon;
