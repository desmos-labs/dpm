import { Message } from 'types/transactions';
import { useTranslation } from 'react-i18next';
import React from 'react';

const useMessageName = (message: Message) => {
  const { t } = useTranslation();

  return React.useMemo(() => {
    const messageType = message.typeUrl.split('.').pop()!;
    switch (messageType) {
      // Authz module
      case 'MsgGrant':
        return t('messages.authz:grant');
      case 'MsgExec':
        return t('messages.authz:exec');
      case 'MsgRevoke':
        return t('messages.authz:revoke grant');

      // Bank module
      case 'MsgSend':
        return t('messages.bank:send');
      case 'MsgMultiSend':
        return t('messages.bank:multi send');

      // Distribution module
      case 'MsgWithdrawDelegatorReward':
        return t('messages.distribution:withdraw rewards');
      case 'MsgSetWithdrawAddress':
        return t('messages.distribution:set withdraw address');
      case 'MsgWithdrawValidatorCommission':
        return t('messages.distribution:withdraw commission');
      case 'MsgFundCommunityPool':
        return t('messages.distribution:fund community pool');

      // Feegrant module
      case 'MsgGrantAllowance':
        return t('messages.feegrant:grant allowance');
      case 'MsgRevokeAllowance':
        return t('messages.feegrant:revoke allowance');

      // Gov module
      case 'MsgSubmitProposal':
        return t('messages.gov:submit proposal');
      case 'MsgDeposit':
        return t('messages.gov:deposit');
      case 'MsgVote':
        return t('messages.gov:vote');

      // Posts module
      case 'MsgCreatePost':
        return t('messages.posts:create post');
      case 'MsgEditPost':
        return t('messages.posts:edit post');
      case 'MsgDeletePost':
        return t('messages.posts:delete post');
      case 'MsgAddPostAttachment':
        return t('messages.posts:add post attachment');
      case 'MsgRemovePostAttachment':
        return t('messages.posts:remove post attachment');
      case 'MsgAnswerPoll':
        return t('messages.posts:answer poll');

      // Profiles module
      case 'MsgSaveProfile':
        return t('messages.profiles:save profile');
      case 'MsgDeleteProfile':
        return t('messages.profiles:delete profile');
      case 'MsgRequestDTagTransfer':
        return t('messages.profiles:request dtag transfer');
      case 'MsgAcceptDTagTransferRequest':
        return t('messages.profiles:accept dtag transfer');
      case 'MsgRefuseDTagTransferRequest':
        return t('messages.profiles:refuse dtag transfer');
      case 'MsgCancelDTagTransferRequest':
        return t('messages.profiles:cancel dtag transfer');
      case 'MsgLinkApplication':
        return t('messages.profiles:link application');
      case 'MsgUnlinkApplication':
        return t('messages.profiles:unlink application');
      case 'MsgLinkChainAccount':
        return t('messages.profiles:link chain account');
      case 'MsgUnlinkChainAccount':
        return t('messages.profiles:unlink chain account');

      // Reactions
      case 'MsgAddReaction':
        return t('messages.reactions:add reaction');
      case 'MsgRemoveReaction':
        return t('messages.reactions:remove reaction');
      case 'MsgAddRegisteredReaction':
        return t('messages.reactions:add registered reaction');
      case 'MsgEditRegisteredReaction':
        return t('messages.reactions:edit registered reaction');
      case 'MsgRemoveRegisteredReaction':
        return t('messages.reactions:remove registered reaction');
      case 'MsgSetReactionsParams':
        return t('messages.reactions:set reactions params');

      // Relationships module
      case 'MsgCreateRelationship':
        return t('messages.relationships:create relationship');
      case 'MsgDeleteRelationship':
        return t('messages.relationships:delete relationship');
      case 'MsgBlockUser':
        return t('messages.relationships:block user');
      case 'MsgUnblockUser':
        return t('messages.relationships:unblock user');

      // Reports module
      case 'MsgCreateReport':
        return t('messages.reports:create report');
      case 'MsgDeleteReport':
        return t('messages.reports:delete report');
      case 'MsgSupportStandardReason':
        return t('messages.reports:support standard reason');
      case 'MsgAddReason':
        return t('messages.reports:add reason');
      case 'MsgRemoveReason':
        return t('messages.reports:remove reason');

      // Staking module
      case 'MsgCreateValidator':
        return t('messages.staking:create validator');
      case 'MsgEditValidator':
        return t('messages.staking:edit validator');
      case 'MsgDelegate':
        return t('messages.staking:delegate');
      case 'MsgUndelegate':
        return t('messages.staking:undelegate');
      case 'MsgBeginRedelegate':
        return t('messages.staking:redelegate');

      // Subspaces module
      case 'MsgCreateSubspace':
        return t('messages.subspaces:create subspace');
      case 'MsgEditSubspace':
        return t('messages.subspaces:edit subspace');
      case 'MsgDeleteSubspace':
        return t('messages.subspaces:delete subspace');
      case 'MsgCreateSection':
        return t('messages.subspaces:create section');
      case 'MsgEditSection':
        return t('messages.subspaces:edit section');
      case 'MsgMoveSection':
        return t('messages.subspaces:move section');
      case 'MsgDeleteSection':
        return t('messages.subspaces:delete section');
      case 'MsgCreateUserGroup':
        return t('messages.subspaces:create user group');
      case 'MsgEditUserGroup':
        return t('messages.subspaces:edit user group');
      case 'MsgMoveUserGroup':
        return t('messages.subspaces:move user group');
      case 'MsgSetUserGroupPermissions':
        return t('messages.subspaces:set user group permissions');
      case 'MsgDeleteUserGroup':
        return t('messages.subspaces:delete user group');
      case 'MsgAddUserToUserGroup':
        return t('messages.subspaces:add user to group');
      case 'MsgRemoveUserFromUserGroup':
        return t('messages.subspaces:remove user from group');
      case 'MsgSetUserPermissions':
        return t('messages.subspaces:set user permissions"');

      // Unsupported message.
      default:
        return messageType;
    }
  }, [t, message.typeUrl]);
};

export default useMessageName;
