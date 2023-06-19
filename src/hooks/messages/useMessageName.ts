import { Message } from 'types/transactions';
import { useTranslation } from 'react-i18next';
import React from 'react';

const NameMap: Record<string, string> = {
  // Authz module
  MsgGrant: 'messages.authz:grant',
  MsgExec: 'messages.authz:exec',
  MsgRevoke: 'messages.authz:revoke grant',

  // Bank module
  MsgSend: 'messages.bank:send',
  MsgMultiSend: 'messages.bank:multi send',

  // Distribution module,
  MsgWithdrawDelegatorReward: 'messages.distribution:withdraw rewards',
  MsgSetWithdrawAddress: 'messages.distribution:set withdraw address',
  MsgWithdrawValidatorCommission: 'messages.distribution:withdraw commission',
  MsgFundCommunityPool: 'messages.distribution:fund community pool',

  // Feegrant module,
  MsgGrantAllowance: 'messages.feegrant:grant allowance',
  MsgRevokeAllowance: 'messages.feegrant:revoke allowance',

  // Gov module,
  MsgSubmitProposal: 'messages.gov:submit proposal',
  MsgDeposit: 'messages.gov:deposit',
  MsgVote: 'messages.gov:vote',

  // IBC,
  MsgTransfer: 'messages.ibc:ibc transfer',

  // Posts module,
  MsgCreatePost: 'messages.posts:create post',
  MsgEditPost: 'messages.posts:edit post',
  MsgDeletePost: 'messages.posts:delete post',
  MsgAddPostAttachment: 'messages.posts:add post attachment',
  MsgRemovePostAttachment: 'messages.posts:remove post attachment',
  MsgAnswerPoll: 'messages.posts:answer poll',

  // Profiles module,
  MsgSaveProfile: 'messages.profiles:save profile',
  MsgDeleteProfile: 'messages.profiles:delete profile',
  MsgRequestDTagTransfer: 'messages.profiles:request dtag transfer',
  MsgAcceptDTagTransferRequest: 'messages.profiles:accept dtag transfer',
  MsgRefuseDTagTransferRequest: 'messages.profiles:refuse dtag transfer',
  MsgCancelDTagTransferRequest: 'messages.profiles:cancel dtag transfer',
  MsgLinkApplication: 'messages.profiles:link application',
  MsgUnlinkApplication: 'messages.profiles:unlink application',
  MsgLinkChainAccount: 'messages.profiles:link chain account',
  MsgUnlinkChainAccount: 'messages.profiles:unlink chain account',

  // Reactions,
  MsgAddReaction: 'messages.reactions:add reaction',
  MsgRemoveReaction: 'messages.reactions:remove reaction',
  MsgAddRegisteredReaction: 'messages.reactions:add registered reaction',
  MsgEditRegisteredReaction: 'messages.reactions:edit registered reaction',
  MsgRemoveRegisteredReaction: 'messages.reactions:remove registered reaction',
  MsgSetReactionsParams: 'messages.reactions:set reactions params',

  // Relationships module,
  MsgCreateRelationship: 'messages.relationships:create relationship',
  MsgDeleteRelationship: 'messages.relationships:delete relationship',
  MsgBlockUser: 'messages.relationships:block user',
  MsgUnblockUser: 'messages.relationships:unblock user',

  // Reports module,
  MsgCreateReport: 'messages.reports:create report',
  MsgDeleteReport: 'messages.reports:delete report',
  MsgSupportStandardReason: 'messages.reports:support standard reason',
  MsgAddReason: 'messages.reports:add reason',
  MsgRemoveReason: 'messages.reports:remove reason',

  // Staking module,
  MsgCreateValidator: 'messages.staking:create validator',
  MsgEditValidator: 'messages.staking:edit validator',
  MsgDelegate: 'messages.staking:delegate',
  MsgUndelegate: 'messages.staking:undelegate',
  MsgBeginRedelegate: 'messages.staking:redelegate',

  // Subspaces module,
  MsgCreateSubspace: 'messages.subspaces:create subspace',
  MsgEditSubspace: 'messages.subspaces:edit subspace',
  MsgDeleteSubspace: 'messages.subspaces:delete subspace',
  MsgCreateSection: 'messages.subspaces:create section',
  MsgEditSection: 'messages.subspaces:edit section',
  MsgMoveSection: 'messages.subspaces:move section',
  MsgDeleteSection: 'messages.subspaces:delete section',
  MsgCreateUserGroup: 'messages.subspaces:create user group',
  MsgEditUserGroup: 'messages.subspaces:edit user group',
  MsgMoveUserGroup: 'messages.subspaces:move user group',
  MsgSetUserGroupPermissions: 'messages.subspaces:set user group permissions',
  MsgDeleteUserGroup: 'messages.subspaces:delete user group',
  MsgAddUserToUserGroup: 'messages.subspaces:add user to group',
  MsgRemoveUserFromUserGroup: 'messages.subspaces:remove user from group',
  MsgSetUserPermissions: 'messages.subspaces:set user permissions"',
};

/**
 * Hook that provides a human-readable name of the provided {@link Message}.
 */
const useMessageName = (message: Message) => {
  const { t } = useTranslation();

  return React.useMemo(() => {
    const messageType = message.typeUrl.split('.').pop()!;
    const translationKey = NameMap[messageType];
    return translationKey ? t(translationKey) : messageType;
  }, [message.typeUrl, t]);
};

export default useMessageName;
