import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { coin } from '@cosmjs/amino';
import { Transaction } from 'types/transactions';
import ROUTES from 'navigation/routes';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  Bech32AddressTypeUrl,
  FreeTextValueTypeUrl,
  GenericAuthorizationTypeUrl,
  MediaTypeUrl,
  MsgAcceptDTagTransferRequestTypeUrl,
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionTypeUrl,
  MsgAddRegisteredReactionTypeUrl,
  MsgAddUserToUserGroupTypeUrl,
  MsgAnswerPollTypeUrl,
  MsgCancelDTagTransferRequestTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgCreateSectionTypeUrl,
  MsgCreateSubspaceTypeUrl,
  MsgCreateUserGroupTypeUrl,
  MsgCreateValidatorTypeUrl,
  MsgDelegateTypeUrl,
  MsgDeletePostTypeUrl,
  MsgDeleteProfileTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgDeleteReportTypeUrl,
  MsgDeleteSectionTypeUrl,
  MsgDeleteSubspaceTypeUrl,
  MsgDeleteUserGroupTypeUrl,
  MsgDepositTypeUrl,
  MsgEditPostTypeUrl,
  MsgEditSectionTypeUrl,
  MsgEditSubspaceTypeUrl,
  MsgEditUserGroupTypeUrl,
  MsgEditValidatorTypeUrl,
  MsgFundCommunityPoolTypeUrl,
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
  MsgRemoveUserFromUserGroupTypeUrl,
  MsgRequestDTagTransferTypeUrl,
  MsgRevokeAllowanceTypeUrl,
  MsgRevokeTypeUrl,
  MsgSaveProfileTypeUrl,
  MsgSendTypeUrl,
  MsgSetReactionsParamsTypeUrl,
  MsgSetUserGroupPermissionsTypeUrl,
  MsgSetUserPermissionsTypeUrl,
  MsgSetWithdrawAddressTypeUrl,
  MsgSubmitProposalTypeUrl,
  MsgUnlinkApplicationTypeUrl,
  MsgUnlinkChainAccountTypeUrl,
  MsgVoteTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
  MsgWithdrawValidatorCommissionTypeUrl,
  PeriodicAllowanceTypeUrl,
  PollTypeUrl,
  PostTargetTypeUrl,
  RegisteredReactionValueTypeUrl,
  timestampFromDate,
  UserTargetTypeUrl,
} from '@desmoslabs/desmjs';
import { MsgExec, MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgExecTypeUrl, MsgTransferTypeUrl } from 'types/cosmos';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgGrantAllowance, MsgRevokeAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import {
  AllowedMsgAllowance,
  BasicAllowance,
  PeriodicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import { MsgDeposit, MsgSubmitProposal, MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import {
  MsgAddPostAttachment,
  MsgAnswerPoll,
  MsgCreatePost,
  MsgDeletePost,
  MsgEditPost,
  MsgRemovePostAttachment,
} from '@desmoslabs/desmjs-types/desmos/posts/v3/msgs';
import { Media, Poll, ReplySetting } from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import {
  MsgAcceptDTagTransferRequest,
  MsgCancelDTagTransferRequest,
  MsgRefuseDTagTransferRequest,
  MsgRequestDTagTransfer,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_dtag_requests';
import {
  MsgDeleteProfile,
  MsgSaveProfile,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import {
  MsgLinkApplication,
  MsgUnlinkApplication,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_app_links';
import {
  MsgLinkChainAccount,
  MsgUnlinkChainAccount,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {
  MsgAddReaction,
  MsgAddRegisteredReaction,
  MsgEditRegisteredReaction,
  MsgRemoveReaction,
  MsgRemoveRegisteredReaction,
  MsgSetReactionsParams,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/msgs';
import {
  FreeTextValue,
  RegisteredReactionValue,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import {
  MsgEditRegisteredReactionTypeUrl,
  MsgRemoveRegisteredReactionTypeUrl,
} from '@desmoslabs/desmjs/build/const/reactions';
import {
  MsgBlockUser,
  MsgCreateRelationship,
  MsgDeleteRelationship,
  MsgUnblockUser,
} from '@desmoslabs/desmjs-types/desmos/relationships/v1/msgs';
import {
  MsgBlockUserTypeUrl,
  MsgUnblockUserTypeUrl,
} from '@desmoslabs/desmjs/build/const/relationships';
import {
  MsgAddReason,
  MsgCreateReport,
  MsgDeleteReport,
  MsgRemoveReason,
  MsgSupportStandardReason,
} from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import { PostTarget, UserTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';
import {
  MsgAddReasonTypeUrl,
  MsgRemoveReasonTypeUrl,
  MsgSupportStandardReasonTypeUrl,
} from '@desmoslabs/desmjs/build/const/reports';
import Long from 'long';
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { PubKey as Secp256k1PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import {
  MsgBeginRedelegateTypeUrl,
  MsgUndelegateTypeUrl,
} from '@desmoslabs/desmjs/build/const/cosmos/staking';
import {
  MsgAddUserToUserGroup,
  MsgCreateSection,
  MsgCreateSubspace,
  MsgCreateUserGroup,
  MsgDeleteSection,
  MsgDeleteSubspace,
  MsgDeleteUserGroup,
  MsgEditSection,
  MsgEditSubspace,
  MsgEditUserGroup,
  MsgMoveSection,
  MsgMoveUserGroup,
  MsgRemoveUserFromUserGroup,
  MsgSetUserGroupPermissions,
  MsgSetUserPermissions,
} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/msgs';

const TEST_ADDRESS1 = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
const TEST_ADDRESS2 = 'desmos1jvw63nnapa899l753dh4znw5u6kc9zycpc043v';

const useShowTestTransaction = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    const messages: EncodeObject[] = [
      // Authz Module
      {
        typeUrl: MsgGrantTypeUrl,
        value: MsgGrant.fromPartial({
          grantee: TEST_ADDRESS1,
          granter: TEST_ADDRESS2,
          grant: Grant.fromPartial({
            expiration: {
              seconds: '100000',
            },
            authorization: {
              typeUrl: GenericAuthorizationTypeUrl,
              value: GenericAuthorization.encode(
                GenericAuthorization.fromPartial({
                  msg: MsgEditPostTypeUrl,
                }),
              ).finish(),
            },
          }),
        }),
      },
      {
        typeUrl: MsgExecTypeUrl,
        value: MsgExec.fromPartial({
          grantee: 'desmos1grantee',
          msgs: [
            {
              typeUrl: MsgSendTypeUrl,
              value: MsgSend.encode(
                MsgSend.fromPartial({
                  fromAddress: TEST_ADDRESS1,
                  toAddress: TEST_ADDRESS2,
                  amount: [coin('0', 'udaric')],
                }),
              ).finish(),
            },
          ],
        }),
      },
      {
        typeUrl: MsgRevokeTypeUrl,
        value: MsgRevoke.fromPartial({
          granter: TEST_ADDRESS2,
          grantee: TEST_ADDRESS1,
          msgTypeUrl: MsgSendTypeUrl,
        }),
      },

      // Bank module
      {
        typeUrl: MsgSendTypeUrl,
        value: MsgSend.fromPartial({
          fromAddress: TEST_ADDRESS1,
          toAddress: TEST_ADDRESS2,
          amount: [coin('10000', 'udaric')],
        }),
      },
      {
        typeUrl: MsgMultiSendTypeUrl,
        value: MsgMultiSend.fromPartial({
          inputs: [
            {
              address: TEST_ADDRESS1,
              coins: [coin('0', 'udaric')],
            },
          ],
          outputs: [
            {
              address: TEST_ADDRESS2,
              coins: [coin('10', 'udaric')],
            },
            {
              address: TEST_ADDRESS2,
              coins: [coin('11', 'udaric')],
            },
          ],
        }),
      },
      // Distribution module
      {
        typeUrl: MsgWithdrawDelegatorRewardTypeUrl,
        value: MsgWithdrawDelegatorReward.fromPartial({
          validatorAddress: 'desmos1validator',
          delegatorAddress: 'desmos1delegator',
        }),
      },
      {
        typeUrl: MsgSetWithdrawAddressTypeUrl,
        value: MsgSetWithdrawAddress.fromPartial({
          delegatorAddress: 'desmos1delegator',
          withdrawAddress: 'desmos1newaddress',
        }),
      },
      {
        typeUrl: MsgWithdrawValidatorCommissionTypeUrl,
        value: MsgWithdrawValidatorCommission.fromPartial({
          validatorAddress: 'desmos1validator',
        }),
      },
      {
        typeUrl: MsgFundCommunityPoolTypeUrl,
        value: MsgFundCommunityPool.fromPartial({
          amount: [coin('10000000', 'udaric')],
          depositor: 'desmos1depositor',
        }),
      },

      // Fee grant module
      {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: BasicAllowanceTypeUrl,
            value: BasicAllowance.encode(
              BasicAllowance.fromPartial({
                expiration: {
                  seconds: 200000,
                },
                spendLimit: [coin(2000, 'udaric')],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: PeriodicAllowanceTypeUrl,
            value: PeriodicAllowance.encode(
              PeriodicAllowance.fromPartial({
                basic: {
                  spendLimit: [coin(200000, 'udaric')],
                  expiration: {
                    seconds: 2000000,
                  },
                },
                period: {
                  seconds: 1000000,
                },
                periodReset: {
                  seconds: 5000000,
                },
                periodCanSpend: [coin(20000, 'udaric')],
                periodSpendLimit: [coin(1000, 'udaric')],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: AllowedMsgAllowanceTypeUrl,
            value: AllowedMsgAllowance.encode(
              AllowedMsgAllowance.fromPartial({
                allowance: {
                  typeUrl: BasicAllowanceTypeUrl,
                  value: BasicAllowance.encode(
                    BasicAllowance.fromPartial({
                      expiration: {
                        seconds: 200000,
                      },
                      spendLimit: [coin(2000, 'udaric')],
                    }),
                  ).finish(),
                },
                allowedMessages: [MsgSendTypeUrl, MsgSendTypeUrl, MsgSendTypeUrl],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgRevokeAllowanceTypeUrl,
        value: MsgRevokeAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
        }),
      },

      // Gov module
      {
        typeUrl: MsgSubmitProposalTypeUrl,
        value: MsgSubmitProposal.fromPartial({
          proposer: 'desmos1proposer',
          initialDeposit: [coin(10000, 'udaric')],
        }),
      },
      {
        typeUrl: MsgDepositTypeUrl,
        value: MsgDeposit.fromPartial({
          depositor: 'desmos1depositor',
          amount: [coin(10000, 'udaric')],
          proposalId: 42,
        }),
      },
      {
        typeUrl: MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_ABSTAIN,
          proposalId: 42,
        }),
      },
      {
        typeUrl: MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_YES,
          proposalId: 42,
        }),
      },
      {
        typeUrl: MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_NO,
          proposalId: 42,
        }),
      },
      {
        typeUrl: MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_NO_WITH_VETO,
          proposalId: 42,
        }),
      },

      // IBC
      {
        typeUrl: MsgTransferTypeUrl,
        value: MsgTransfer.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
          memo: 'ibc memo',
          sourcePort: 'source port',
          sourceChannel: 'source channel',
          token: coin('1000000000', 'udaric'),
          timeoutHeight: {
            revisionNumber: 2,
            revisionHeight: 3000,
          },
          timeoutTimestamp: new Date().getTime(),
        }),
      },

      // Posts
      {
        typeUrl: MsgAddPostAttachmentTypeUrl,
        value: MsgAddPostAttachment.fromPartial({
          editor: 'desmos1editor',
          postId: 1,
          content: {
            typeUrl: PollTypeUrl,
            value: Poll.encode(
              Poll.fromPartial({
                allowsAnswerEdits: true,
                allowsMultipleAnswers: true,
                question: 'test question',
                providedAnswers: [{ text: '1' }, { text: '2' }],
                endDate: timestampFromDate(new Date()),
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgAnswerPollTypeUrl,
        value: MsgAnswerPoll.fromPartial({
          signer: 'desmos1signer',
          subspaceId: 1,
          postId: 2,
          pollId: 3,
          answersIndexes: [1, 2, 3],
        }),
      },
      {
        typeUrl: MsgCreatePostTypeUrl,
        value: MsgCreatePost.fromPartial({
          author: 'desmos1author',
          subspaceId: 1,
          sectionId: 0,
          text: 'test post',
          replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
          attachments: [
            {
              typeUrl: PollTypeUrl,
              value: Poll.encode(
                Poll.fromPartial({
                  allowsAnswerEdits: true,
                  allowsMultipleAnswers: true,
                  question: 'test question',
                  providedAnswers: [{ text: '1' }, { text: '2' }],
                  endDate: timestampFromDate(new Date()),
                }),
              ).finish(),
            },
            {
              typeUrl: MediaTypeUrl,
              value: Media.encode(
                Media.fromPartial({
                  uri: 'https://test-uri.com',
                  mimeType: 'image/png',
                }),
              ).finish(),
            },
          ],
        }),
      },
      {
        typeUrl: MsgDeletePostTypeUrl,
        value: MsgDeletePost.fromPartial({
          signer: 'desmos1signer',
          postId: 1,
          subspaceId: 2,
        }),
      },
      {
        typeUrl: MsgEditPostTypeUrl,
        value: MsgEditPost.fromPartial({
          editor: 'desmos1editor',
          postId: 1,
          subspaceId: 2,
          text: 'new text',
          entities: {
            hashtags: [
              {
                start: 0,
                end: 2,
                tag: '#new',
              },
            ],
          },
        }),
      },
      {
        typeUrl: MsgRemovePostAttachmentTypeUrl,
        value: MsgRemovePostAttachment.fromPartial({
          editor: 'desmos1editor',
          postId: 1,
          subspaceId: 2,
          attachmentId: 3,
        }),
      },

      // Profiles
      {
        typeUrl: MsgSaveProfileTypeUrl,
        value: MsgSaveProfile.fromPartial({
          creator: 'desmos1creator',
          bio: 'new bio',
          dtag: 'dtag',
          nickname: 'nickname',
          coverPicture: 'https://image.com/cover_picture.png',
          profilePicture: 'https://image.com/profile_picture.png',
        }),
      },
      {
        typeUrl: MsgDeleteProfileTypeUrl,
        value: MsgDeleteProfile.fromPartial({
          creator: 'desmos1creator',
        }),
      },
      {
        typeUrl: MsgRequestDTagTransferTypeUrl,
        value: MsgRequestDTagTransfer.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
        }),
      },
      {
        typeUrl: MsgAcceptDTagTransferRequestTypeUrl,
        value: MsgAcceptDTagTransferRequest.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
          newDtag: 'new-DTag',
        }),
      },
      {
        typeUrl: MsgRefuseDTagTransferRequestTypeUrl,
        value: MsgRefuseDTagTransferRequest.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
        }),
      },
      {
        typeUrl: MsgCancelDTagTransferRequestTypeUrl,
        value: MsgCancelDTagTransferRequest.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
        }),
      },
      {
        typeUrl: MsgLinkApplicationTypeUrl,
        value: MsgLinkApplication.fromPartial({
          sender: 'desmos1sender',
          sourcePort: 'source port',
          sourceChannel: 'source channel',
          timeoutHeight: {
            revisionNumber: 1,
            revisionHeight: 2,
          },
          timeoutTimestamp: new Date().getTime(),
          linkData: {
            username: 'test',
            application: 'twitter',
          },
          callData: 'test call data',
        }),
      },
      {
        typeUrl: MsgUnlinkApplicationTypeUrl,
        value: MsgUnlinkApplication.fromPartial({
          signer: 'desmos1signer',
          application: 'twitter',
          username: 'test',
        }),
      },
      {
        typeUrl: MsgLinkChainAccountTypeUrl,
        value: MsgLinkChainAccount.fromPartial({
          signer: 'desmos1signer',
          chainConfig: {
            name: 'cosmos',
          },
          chainAddress: {
            typeUrl: Bech32AddressTypeUrl,
            value: Bech32Address.encode(
              Bech32Address.fromPartial({
                value: 'cosmos1linked',
                prefix: 'cosmos',
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgUnlinkChainAccountTypeUrl,
        value: MsgUnlinkChainAccount.fromPartial({
          owner: 'desmos1owner',
          target: 'cosmos1linked',
          chainName: 'cosmos',
        }),
      },

      // Reactions
      {
        typeUrl: MsgAddReactionTypeUrl,
        value: MsgAddReaction.fromPartial({
          user: 'desmos1user',
          postId: 1,
          subspaceId: 1,
          value: {
            typeUrl: FreeTextValueTypeUrl,
            value: FreeTextValue.encode(
              FreeTextValue.fromPartial({
                text: 'text reaction',
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgAddReactionTypeUrl,
        value: MsgAddReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          postId: 2,
          value: {
            typeUrl: RegisteredReactionValueTypeUrl,
            value: RegisteredReactionValue.encode(
              RegisteredReactionValue.fromPartial({
                registeredReactionId: 2,
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgRemoveReactionTypeUrl,
        value: MsgRemoveReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          postId: 2,
          reactionId: 3,
        }),
      },
      {
        typeUrl: MsgAddRegisteredReactionTypeUrl,
        value: MsgAddRegisteredReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          displayValue: 'test',
          shorthandCode: 'shorCode',
        }),
      },
      {
        typeUrl: MsgEditRegisteredReactionTypeUrl,
        value: MsgEditRegisteredReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          registeredReactionId: 2,
          displayValue: 'new value',
          shorthandCode: 'new shorthandCode',
        }),
      },
      {
        typeUrl: MsgRemoveRegisteredReactionTypeUrl,
        value: MsgRemoveRegisteredReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          registeredReactionId: 2,
        }),
      },
      {
        typeUrl: MsgSetReactionsParamsTypeUrl,
        value: MsgSetReactionsParams.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          freeText: {
            enabled: true,
            regEx: 'regex',
            maxLength: 42,
          },
          registeredReaction: {
            enabled: true,
          },
        }),
      },

      // Relationships
      {
        typeUrl: MsgCreateRelationshipTypeUrl,
        value: MsgCreateRelationship.fromPartial({
          subspaceId: 1,
          signer: 'desmos1signer',
          counterparty: 'desmos1counterparty',
        }),
      },
      {
        typeUrl: MsgDeleteRelationshipTypeUrl,
        value: MsgDeleteRelationship.fromPartial({
          subspaceId: 1,
          signer: 'desmos1signer',
          counterparty: 'desmos1counterparty',
        }),
      },
      {
        typeUrl: MsgBlockUserTypeUrl,
        value: MsgBlockUser.fromPartial({
          subspaceId: 1,
          blocker: 'desmos1blocker',
          blocked: 'desmos1blocked',
          reason: 'block reason',
        }),
      },
      {
        typeUrl: MsgUnblockUserTypeUrl,
        value: MsgUnblockUser.fromPartial({
          subspaceId: 1,
          blocker: 'desmos1blocker',
          blocked: 'desmos1blocked',
        }),
      },

      // Reports
      {
        typeUrl: MsgCreateReportTypeUrl,
        value: MsgCreateReport.fromPartial({
          subspaceId: 1,
          message: 'test user report',
          target: {
            typeUrl: UserTargetTypeUrl,
            value: UserTarget.encode(
              UserTarget.fromPartial({
                user: 'desmos1user',
              }),
            ).finish(),
          },
          reporter: 'desmos1reporter',
          reasonsIds: [0, 1, 2],
        }),
      },
      {
        typeUrl: MsgCreateReportTypeUrl,
        value: MsgCreateReport.fromPartial({
          subspaceId: 1,
          message: 'test post report',
          target: {
            typeUrl: PostTargetTypeUrl,
            value: PostTarget.encode(
              PostTarget.fromPartial({
                postId: 2,
              }),
            ).finish(),
          },
          reporter: 'desmos1reporter',
          reasonsIds: [0, 1, 2],
        }),
      },
      {
        typeUrl: MsgDeleteReportTypeUrl,
        value: MsgDeleteReport.fromPartial({
          subspaceId: 1,
          reportId: 2,
          signer: 'desmos1signer',
        }),
      },
      {
        typeUrl: MsgSupportStandardReasonTypeUrl,
        value: MsgSupportStandardReason.fromPartial({
          subspaceId: 1,
          standardReasonId: 2,
          signer: 'desmos1signer',
        }),
      },
      {
        typeUrl: MsgAddReasonTypeUrl,
        value: MsgAddReason.fromPartial({
          subspaceId: Long.fromNumber(1),
          title: 'reason title',
          description: 'reason description',
          signer: 'desmos1signer',
        }),
      },
      {
        typeUrl: MsgRemoveReasonTypeUrl,
        value: MsgRemoveReason.fromPartial({
          subspaceId: Long.fromNumber(1),
          reasonId: 2,
          signer: 'desmos1signer',
        }),
      },

      // Staking
      {
        typeUrl: MsgCreateValidatorTypeUrl,
        value: MsgCreateValidator.fromPartial({
          value: coin(2, 'udaric'),
          delegatorAddress: 'delegatoraddress',
          validatorAddress: 'validatoraddress',
          description: {
            moniker: 'moniker',
            details: 'details',
            website: 'https://validator-site.com',
            identity: 'identity',
            securityContact: 'email@security.com',
          },
          commission: {
            rate: '0',
            maxRate: '0',
            maxChangeRate: '1',
          },
          minSelfDelegation: '100',
          pubkey: {
            typeUrl: '/cosmos.crypto.secp256k1.PubKey',
            value: Secp256k1PubKey.encode(
              Secp256k1PubKey.fromPartial({
                key: Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7]),
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgEditValidatorTypeUrl,
        value: MsgEditValidator.fromPartial({
          validatorAddress: 'validatoraddress',
          description: {
            moniker: 'moniker',
            details: 'details',
            website: 'https://validator-site.com',
            identity: 'identity',
            securityContact: 'email@security.com',
          },
          minSelfDelegation: '1',
          commissionRate: '0.1',
        }),
      },
      {
        typeUrl: MsgDelegateTypeUrl,
        value: MsgDelegate.fromPartial({
          validatorAddress: 'validatoraddress',
          delegatorAddress: 'delegator',
          amount: coin('10000', 'udaric'),
        }),
      },
      {
        typeUrl: MsgUndelegateTypeUrl,
        value: MsgUndelegate.fromPartial({
          validatorAddress: 'validatoraddress',
          delegatorAddress: 'delegator',
          amount: coin('10000', 'udaric'),
        }),
      },
      {
        typeUrl: MsgBeginRedelegateTypeUrl,
        value: MsgBeginRedelegate.fromPartial({
          validatorSrcAddress: 'srcvalidatoraddress',
          validatorDstAddress: 'dstvalidatoraddress',
          delegatorAddress: 'delegator',
          amount: coin('10000', 'udaric'),
        }),
      },

      // Subspaces
      {
        typeUrl: MsgAddUserToUserGroupTypeUrl,
        value: MsgAddUserToUserGroup.fromPartial({
          signer: 'signer',
          subspaceId: Long.fromNumber(1),
          groupId: 12,
          user: 'user',
        }),
      },
      {
        typeUrl: MsgCreateSectionTypeUrl,
        value: MsgCreateSection.fromPartial({
          creator: 'creator',
          subspaceId: Long.fromNumber(1),
          name: 'test section',
          description: 'section description',
          parentId: 42,
        }),
      },
      {
        typeUrl: MsgCreateSubspaceTypeUrl,
        value: MsgCreateSubspace.fromPartial({
          creator: 'creator',
          name: 'Test subspace',
          description: 'subspace description',
        }),
      },
      {
        typeUrl: MsgCreateUserGroupTypeUrl,
        value: MsgCreateUserGroup.fromPartial({
          creator: 'creator',
          name: 'Test user group',
          description: 'group description',
          subspaceId: 1,
          sectionId: 0,
          defaultPermissions: ['default p1'],
          initialMembers: ['member1', 'member2'],
        }),
      },
      {
        typeUrl: MsgCreateUserGroupTypeUrl,
        value: MsgCreateUserGroup.fromPartial({
          creator: 'creator',
          name: 'Test user group',
          description: 'group description',
          subspaceId: 1,
          sectionId: 0,
          defaultPermissions: [],
          initialMembers: [],
        }),
      },
      {
        typeUrl: MsgDeleteSectionTypeUrl,
        value: MsgDeleteSection.fromPartial({
          subspaceId: 1,
          sectionId: 0,
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgDeleteSubspaceTypeUrl,
        value: MsgDeleteSubspace.fromPartial({
          subspaceId: 1,
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgDeleteUserGroupTypeUrl,
        value: MsgDeleteUserGroup.fromPartial({
          subspaceId: 1,
          groupId: 3,
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgEditSectionTypeUrl,
        value: MsgEditSection.fromPartial({
          subspaceId: 1,
          sectionId: 2,
          description: 'new description',
          name: 'new name',
          editor: 'editor',
        }),
      },
      {
        typeUrl: MsgEditSubspaceTypeUrl,
        value: MsgEditSubspace.fromPartial({
          subspaceId: 1,
          description: 'new description',
          name: 'new name',
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgEditUserGroupTypeUrl,
        value: MsgEditUserGroup.fromPartial({
          subspaceId: 1,
          groupId: 2,
          description: 'new description',
          name: 'new name',
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgMoveSectionTypeUrl,
        value: MsgMoveSection.fromPartial({
          subspaceId: 1,
          sectionId: 2,
          newParentId: 4,
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgMoveUserGroupTypeUrl,
        value: MsgMoveUserGroup.fromPartial({
          subspaceId: 1,
          groupId: 2,
          newSectionId: 4,
          signer: 'signer',
        }),
      },
      {
        typeUrl: MsgRemoveUserFromUserGroupTypeUrl,
        value: MsgRemoveUserFromUserGroup.fromPartial({
          signer: 'signer',
          subspaceId: 2,
          groupId: 4,
          user: 'user',
        }),
      },
      {
        typeUrl: MsgSetUserGroupPermissionsTypeUrl,
        value: MsgSetUserGroupPermissions.fromPartial({
          signer: 'signer',
          subspaceId: 2,
          groupId: 4,
          permissions: ['P1', 'P2'],
        }),
      },
      {
        typeUrl: MsgSetUserPermissionsTypeUrl,
        value: MsgSetUserPermissions.fromPartial({
          signer: 'signer',
          subspaceId: 2,
          sectionId: 0,
          user: 'user',
          permissions: ['P1', 'P2'],
        }),
      },
    ];

    const transaction: Transaction = {
      hash: 'tx-hash',
      success: true,
      fee: {
        amount: [coin('10000000', 'udaric')],
        gas: '2000000',
      },
      timestamp: new Date().toString(),
      memo: 'this is a test transaction to showcase all messages',
      messages,
    };

    navigation.navigate(ROUTES.TRANSACTION_DETAILS, {
      transaction,
    });
  }, [navigation]);
};

export default useShowTestTransaction;
