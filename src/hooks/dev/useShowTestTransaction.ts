import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { coin } from '@cosmjs/amino';
import { Transaction } from 'types/transactions';
import ROUTES from 'navigation/routes';
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
  timestampFromDate,
  TokenFactory,
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
  MsgAcceptPostOwnerTransferRequest,
  MsgAddPostAttachment,
  MsgAnswerPoll,
  MsgCancelPostOwnerTransferRequest,
  MsgCreatePost,
  MsgDeletePost,
  MsgEditPost,
  MsgMovePost,
  MsgRefusePostOwnerTransferRequest,
  MsgRemovePostAttachment,
  MsgRequestPostOwnerTransfer,
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
  MsgBlockUser,
  MsgCreateRelationship,
  MsgDeleteRelationship,
  MsgUnblockUser,
} from '@desmoslabs/desmjs-types/desmos/relationships/v1/msgs';
import {
  MsgAddReason,
  MsgCreateReport,
  MsgDeleteReport,
  MsgRemoveReason,
  MsgSupportStandardReason,
} from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import { PostTarget, UserTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';
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
  MsgUpdateSubspaceFeeTokens,
} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/msgs';
import {
  MsgBurn,
  MsgCreateDenom,
  MsgMint,
  MsgSetDenomMetadata,
  MsgUpdateParams,
} from '@desmoslabs/desmjs-types/desmos/tokenfactory/v1/msgs';
import { Metadata } from '@desmoslabs/desmjs-types/cosmos/bank/v1beta1/bank';

const TEST_ADDRESS1 = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
const TEST_ADDRESS2 = 'desmos1jvw63nnapa899l753dh4znw5u6kc9zycpc043v';

const useShowTestTransaction = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    const messages: EncodeObject[] = [
      // Authz Module
      {
        typeUrl: Authz.v1beta1.MsgGrantTypeUrl,
        value: MsgGrant.fromPartial({
          grantee: TEST_ADDRESS1,
          granter: TEST_ADDRESS2,
          grant: Grant.fromPartial({
            expiration: {
              seconds: '100000',
            },
            authorization: {
              typeUrl: Authz.v1beta1.GenericAuthorizationTypeUrl,
              value: GenericAuthorization.encode(
                GenericAuthorization.fromPartial({
                  msg: Posts.v3.MsgEditPostTypeUrl,
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
              typeUrl: Bank.v1beta1.MsgSendTypeUrl,
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
        typeUrl: Authz.v1beta1.MsgRevokeTypeUrl,
        value: MsgRevoke.fromPartial({
          granter: TEST_ADDRESS2,
          grantee: TEST_ADDRESS1,
          msgTypeUrl: Bank.v1beta1.MsgSendTypeUrl,
        }),
      },

      // Bank module
      {
        typeUrl: Bank.v1beta1.MsgSendTypeUrl,
        value: MsgSend.fromPartial({
          fromAddress: TEST_ADDRESS1,
          toAddress: TEST_ADDRESS2,
          amount: [coin('10000', 'udaric')],
        }),
      },
      {
        typeUrl: Bank.v1beta1.MsgMultiSendTypeUrl,
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
        typeUrl: Distribution.v1beta1.MsgWithdrawDelegatorRewardTypeUrl,
        value: MsgWithdrawDelegatorReward.fromPartial({
          validatorAddress: 'desmos1validator',
          delegatorAddress: 'desmos1delegator',
        }),
      },
      {
        typeUrl: Distribution.v1beta1.MsgSetWithdrawAddressTypeUrl,
        value: MsgSetWithdrawAddress.fromPartial({
          delegatorAddress: 'desmos1delegator',
          withdrawAddress: 'desmos1newaddress',
        }),
      },
      {
        typeUrl: Distribution.v1beta1.MsgWithdrawValidatorCommissionTypeUrl,
        value: MsgWithdrawValidatorCommission.fromPartial({
          validatorAddress: 'desmos1validator',
        }),
      },
      {
        typeUrl: Distribution.v1beta1.MsgFundCommunityPoolTypeUrl,
        value: MsgFundCommunityPool.fromPartial({
          amount: [coin('10000000', 'udaric')],
          depositor: 'desmos1depositor',
        }),
      },

      // Fee grant module
      {
        typeUrl: Feegrant.v1beta1.MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
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
        typeUrl: Feegrant.v1beta1.MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: Feegrant.v1beta1.PeriodicAllowanceTypeUrl,
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
        typeUrl: Feegrant.v1beta1.MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl,
            value: AllowedMsgAllowance.encode(
              AllowedMsgAllowance.fromPartial({
                allowance: {
                  typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
                  value: BasicAllowance.encode(
                    BasicAllowance.fromPartial({
                      expiration: {
                        seconds: 200000,
                      },
                      spendLimit: [coin(2000, 'udaric')],
                    }),
                  ).finish(),
                },
                allowedMessages: [
                  Bank.v1beta1.MsgSendTypeUrl,
                  Bank.v1beta1.MsgSendTypeUrl,
                  Bank.v1beta1.MsgSendTypeUrl,
                ],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: Feegrant.v1beta1.MsgRevokeAllowanceTypeUrl,
        value: MsgRevokeAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
        }),
      },

      // Gov module
      {
        typeUrl: Gov.v1beta1.MsgSubmitProposalTypeUrl,
        value: MsgSubmitProposal.fromPartial({
          proposer: 'desmos1proposer',
          initialDeposit: [coin(10000, 'udaric')],
        }),
      },
      {
        typeUrl: Gov.v1beta1.MsgDepositTypeUrl,
        value: MsgDeposit.fromPartial({
          depositor: 'desmos1depositor',
          amount: [coin(10000, 'udaric')],
          proposalId: 42,
        }),
      },
      {
        typeUrl: Gov.v1beta1.MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_ABSTAIN,
          proposalId: 42,
        }),
      },
      {
        typeUrl: Gov.v1beta1.MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_YES,
          proposalId: 42,
        }),
      },
      {
        typeUrl: Gov.v1beta1.MsgVoteTypeUrl,
        value: MsgVote.fromPartial({
          voter: 'desmos1voter',
          option: VoteOption.VOTE_OPTION_NO,
          proposalId: 42,
        }),
      },
      {
        typeUrl: Gov.v1beta1.MsgVoteTypeUrl,
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
        typeUrl: Posts.v3.MsgAddPostAttachmentTypeUrl,
        value: MsgAddPostAttachment.fromPartial({
          editor: 'desmos1editor',
          postId: 1,
          content: {
            typeUrl: Posts.v3.PollTypeUrl,
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
        typeUrl: Posts.v3.MsgAnswerPollTypeUrl,
        value: MsgAnswerPoll.fromPartial({
          signer: 'desmos1signer',
          subspaceId: 1,
          postId: 2,
          pollId: 3,
          answersIndexes: [1, 2, 3],
        }),
      },
      {
        typeUrl: Posts.v3.MsgCreatePostTypeUrl,
        value: MsgCreatePost.fromPartial({
          author: 'desmos1author',
          subspaceId: 1,
          sectionId: 0,
          text: 'test post',
          replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
          attachments: [
            {
              typeUrl: Posts.v3.PollTypeUrl,
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
              typeUrl: Posts.v3.MediaTypeUrl,
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
        typeUrl: Posts.v3.MsgDeletePostTypeUrl,
        value: MsgDeletePost.fromPartial({
          signer: 'desmos1signer',
          postId: 1,
          subspaceId: 2,
        }),
      },
      {
        typeUrl: Posts.v3.MsgEditPostTypeUrl,
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
        typeUrl: Posts.v3.MsgRemovePostAttachmentTypeUrl,
        value: MsgRemovePostAttachment.fromPartial({
          editor: 'desmos1editor',
          postId: 1,
          subspaceId: 2,
          attachmentId: 3,
        }),
      },
      {
        typeUrl: Posts.v3.MsgMovePostTypeUrl,
        value: MsgMovePost.fromPartial({
          postId: 1,
          subspaceId: 1,
          targetSubspaceId: 2,
          targetSectionId: 0,
          owner: 'owner',
        }),
      },
      {
        typeUrl: Posts.v3.MsgRequestPostOwnerTransferTypeUrl,
        value: MsgRequestPostOwnerTransfer.fromPartial({
          sender: 'sender',
          subspaceId: 1,
          postId: 1,
          receiver: 'receiver',
        }),
      },
      {
        typeUrl: Posts.v3.MsgCancelPostOwnerTransferRequestTypeUrl,
        value: MsgCancelPostOwnerTransferRequest.fromPartial({
          sender: 'sender',
          subspaceId: 1,
          postId: 1,
        }),
      },
      {
        typeUrl: Posts.v3.MsgAcceptPostOwnerTransferRequestTypeUrl,
        value: MsgAcceptPostOwnerTransferRequest.fromPartial({
          postId: 1,
          subspaceId: 1,
          receiver: 'receiver',
        }),
      },
      {
        typeUrl: Posts.v3.MsgRefusePostOwnerTransferRequestTypeUrl,
        value: MsgRefusePostOwnerTransferRequest.fromPartial({
          postId: 1,
          subspaceId: 1,
          receiver: 'receiver',
        }),
      },

      // Profiles
      {
        typeUrl: Profiles.v3.MsgSaveProfileTypeUrl,
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
        typeUrl: Profiles.v3.MsgDeleteProfileTypeUrl,
        value: MsgDeleteProfile.fromPartial({
          creator: 'desmos1creator',
        }),
      },
      {
        typeUrl: Profiles.v3.MsgRequestDTagTransferTypeUrl,
        value: MsgRequestDTagTransfer.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
        }),
      },
      {
        typeUrl: Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl,
        value: MsgAcceptDTagTransferRequest.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
          newDtag: 'new-DTag',
        }),
      },
      {
        typeUrl: Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl,
        value: MsgRefuseDTagTransferRequest.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
        }),
      },
      {
        typeUrl: Profiles.v3.MsgCancelDTagTransferRequestTypeUrl,
        value: MsgCancelDTagTransferRequest.fromPartial({
          sender: 'desmos1sender',
          receiver: 'desmos1receiver',
        }),
      },
      {
        typeUrl: Profiles.v3.MsgLinkApplicationTypeUrl,
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
        typeUrl: Profiles.v3.MsgUnlinkApplicationTypeUrl,
        value: MsgUnlinkApplication.fromPartial({
          signer: 'desmos1signer',
          application: 'twitter',
          username: 'test',
        }),
      },
      {
        typeUrl: Profiles.v3.MsgLinkChainAccountTypeUrl,
        value: MsgLinkChainAccount.fromPartial({
          signer: 'desmos1signer',
          chainConfig: {
            name: 'cosmos',
          },
          chainAddress: {
            typeUrl: Profiles.v3.Bech32AddressTypeUrl,
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
        typeUrl: Profiles.v3.MsgUnlinkChainAccountTypeUrl,
        value: MsgUnlinkChainAccount.fromPartial({
          owner: 'desmos1owner',
          target: 'cosmos1linked',
          chainName: 'cosmos',
        }),
      },

      // Reactions
      {
        typeUrl: Reactions.v1.MsgAddReactionTypeUrl,
        value: MsgAddReaction.fromPartial({
          user: 'desmos1user',
          postId: 1,
          subspaceId: 1,
          value: {
            typeUrl: Reactions.v1.FreeTextValueTypeUrl,
            value: FreeTextValue.encode(
              FreeTextValue.fromPartial({
                text: 'text reaction',
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: Reactions.v1.MsgAddReactionTypeUrl,
        value: MsgAddReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          postId: 2,
          value: {
            typeUrl: Reactions.v1.RegisteredReactionValueTypeUrl,
            value: RegisteredReactionValue.encode(
              RegisteredReactionValue.fromPartial({
                registeredReactionId: 2,
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: Reactions.v1.MsgRemoveReactionTypeUrl,
        value: MsgRemoveReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          postId: 2,
          reactionId: 3,
        }),
      },
      {
        typeUrl: Reactions.v1.MsgAddRegisteredReactionTypeUrl,
        value: MsgAddRegisteredReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          displayValue: 'test',
          shorthandCode: 'shorCode',
        }),
      },
      {
        typeUrl: Reactions.v1.MsgEditRegisteredReactionTypeUrl,
        value: MsgEditRegisteredReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          registeredReactionId: 2,
          displayValue: 'new value',
          shorthandCode: 'new shorthandCode',
        }),
      },
      {
        typeUrl: Reactions.v1.MsgRemoveRegisteredReactionTypeUrl,
        value: MsgRemoveRegisteredReaction.fromPartial({
          user: 'desmos1user',
          subspaceId: 1,
          registeredReactionId: 2,
        }),
      },
      {
        typeUrl: Reactions.v1.MsgSetReactionsParamsTypeUrl,
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
        typeUrl: Relationships.v1.MsgCreateRelationshipTypeUrl,
        value: MsgCreateRelationship.fromPartial({
          subspaceId: 1,
          signer: 'desmos1signer',
          counterparty: 'desmos1counterparty',
        }),
      },
      {
        typeUrl: Relationships.v1.MsgDeleteRelationshipTypeUrl,
        value: MsgDeleteRelationship.fromPartial({
          subspaceId: 1,
          signer: 'desmos1signer',
          counterparty: 'desmos1counterparty',
        }),
      },
      {
        typeUrl: Relationships.v1.MsgBlockUserTypeUrl,
        value: MsgBlockUser.fromPartial({
          subspaceId: 1,
          blocker: 'desmos1blocker',
          blocked: 'desmos1blocked',
          reason: 'block reason',
        }),
      },
      {
        typeUrl: Relationships.v1.MsgUnblockUserTypeUrl,
        value: MsgUnblockUser.fromPartial({
          subspaceId: 1,
          blocker: 'desmos1blocker',
          blocked: 'desmos1blocked',
        }),
      },

      // Reports
      {
        typeUrl: Reports.v1.MsgCreateReportTypeUrl,
        value: MsgCreateReport.fromPartial({
          subspaceId: 1,
          message: 'test user report',
          target: {
            typeUrl: Reports.v1.UserTargetTypeUrl,
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
        typeUrl: Reports.v1.MsgCreateReportTypeUrl,
        value: MsgCreateReport.fromPartial({
          subspaceId: 1,
          message: 'test post report',
          target: {
            typeUrl: Reports.v1.PostTargetTypeUrl,
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
        typeUrl: Reports.v1.MsgDeleteReportTypeUrl,
        value: MsgDeleteReport.fromPartial({
          subspaceId: 1,
          reportId: 2,
          signer: 'desmos1signer',
        }),
      },
      {
        typeUrl: Reports.v1.MsgSupportStandardReasonTypeUrl,
        value: MsgSupportStandardReason.fromPartial({
          subspaceId: 1,
          standardReasonId: 2,
          signer: 'desmos1signer',
        }),
      },
      {
        typeUrl: Reports.v1.MsgAddReasonTypeUrl,
        value: MsgAddReason.fromPartial({
          subspaceId: Long.fromNumber(1),
          title: 'reason title',
          description: 'reason description',
          signer: 'desmos1signer',
        }),
      },
      {
        typeUrl: Reports.v1.MsgRemoveReasonTypeUrl,
        value: MsgRemoveReason.fromPartial({
          subspaceId: Long.fromNumber(1),
          reasonId: 2,
          signer: 'desmos1signer',
        }),
      },

      // Staking
      {
        typeUrl: Staking.v1beta1.MsgCreateValidatorTypeUrl,
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
        typeUrl: Staking.v1beta1.MsgEditValidatorTypeUrl,
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
        typeUrl: Staking.v1beta1.MsgDelegateTypeUrl,
        value: MsgDelegate.fromPartial({
          validatorAddress: 'validatoraddress',
          delegatorAddress: 'delegator',
          amount: coin('10000', 'udaric'),
        }),
      },
      {
        typeUrl: Staking.v1beta1.MsgUndelegateTypeUrl,
        value: MsgUndelegate.fromPartial({
          validatorAddress: 'validatoraddress',
          delegatorAddress: 'delegator',
          amount: coin('10000', 'udaric'),
        }),
      },
      {
        typeUrl: Staking.v1beta1.MsgBeginRedelegateTypeUrl,
        value: MsgBeginRedelegate.fromPartial({
          validatorSrcAddress: 'srcvalidatoraddress',
          validatorDstAddress: 'dstvalidatoraddress',
          delegatorAddress: 'delegator',
          amount: coin('10000', 'udaric'),
        }),
      },

      // Subspaces
      {
        typeUrl: Subspaces.v3.MsgAddUserToUserGroupTypeUrl,
        value: MsgAddUserToUserGroup.fromPartial({
          signer: 'signer',
          subspaceId: Long.fromNumber(1),
          groupId: 12,
          user: 'user',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgCreateSectionTypeUrl,
        value: MsgCreateSection.fromPartial({
          creator: 'creator',
          subspaceId: Long.fromNumber(1),
          name: 'test section',
          description: 'section description',
          parentId: 42,
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgCreateSubspaceTypeUrl,
        value: MsgCreateSubspace.fromPartial({
          creator: 'creator',
          name: 'Test subspace',
          description: 'subspace description',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgCreateUserGroupTypeUrl,
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
        typeUrl: Subspaces.v3.MsgCreateUserGroupTypeUrl,
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
        typeUrl: Subspaces.v3.MsgDeleteSectionTypeUrl,
        value: MsgDeleteSection.fromPartial({
          subspaceId: 1,
          sectionId: 0,
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgDeleteSubspaceTypeUrl,
        value: MsgDeleteSubspace.fromPartial({
          subspaceId: 1,
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgDeleteUserGroupTypeUrl,
        value: MsgDeleteUserGroup.fromPartial({
          subspaceId: 1,
          groupId: 3,
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgEditSectionTypeUrl,
        value: MsgEditSection.fromPartial({
          subspaceId: 1,
          sectionId: 2,
          description: 'new description',
          name: 'new name',
          editor: 'editor',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgEditSubspaceTypeUrl,
        value: MsgEditSubspace.fromPartial({
          subspaceId: 1,
          description: 'new description',
          name: 'new name',
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgEditUserGroupTypeUrl,
        value: MsgEditUserGroup.fromPartial({
          subspaceId: 1,
          groupId: 2,
          description: 'new description',
          name: 'new name',
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgMoveSectionTypeUrl,
        value: MsgMoveSection.fromPartial({
          subspaceId: 1,
          sectionId: 2,
          newParentId: 4,
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgMoveUserGroupTypeUrl,
        value: MsgMoveUserGroup.fromPartial({
          subspaceId: 1,
          groupId: 2,
          newSectionId: 4,
          signer: 'signer',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgRemoveUserFromUserGroupTypeUrl,
        value: MsgRemoveUserFromUserGroup.fromPartial({
          signer: 'signer',
          subspaceId: 2,
          groupId: 4,
          user: 'user',
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgSetUserGroupPermissionsTypeUrl,
        value: MsgSetUserGroupPermissions.fromPartial({
          signer: 'signer',
          subspaceId: 2,
          groupId: 4,
          permissions: ['P1', 'P2'],
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgSetUserPermissionsTypeUrl,
        value: MsgSetUserPermissions.fromPartial({
          signer: 'signer',
          subspaceId: 2,
          sectionId: 0,
          user: 'user',
          permissions: ['P1', 'P2'],
        }),
      },
      {
        typeUrl: Subspaces.v3.MsgUpdateSubspaceFeeTokensTypeUrl,
        value: MsgUpdateSubspaceFeeTokens.fromPartial({
          subspaceId: 1,
          authority: 'authority',
          additionalFeeTokens: [{ denom: 'test', amount: '1000' }],
        }),
      },

      // Token factory module.
      {
        typeUrl: TokenFactory.v1.MsgCreateDenomTypeUrl,
        value: MsgCreateDenom.fromPartial({
          sender: 'sender',
          subspaceId: 1,
          subdenom: 'test',
        }),
      },
      {
        typeUrl: TokenFactory.v1.MsgMintTypeUrl,
        value: MsgMint.fromPartial({
          sender: 'sender',
          subspaceId: 1,
          amount: { amount: '100', denom: 'test' },
        }),
      },
      {
        typeUrl: TokenFactory.v1.MsgBurnTypeUrl,
        value: MsgBurn.fromPartial({
          sender: 'sender',
          subspaceId: 1,
          amount: { amount: '100', denom: 'test' },
        }),
      },
      {
        typeUrl: TokenFactory.v1.MsgSetDenomMetadataTypeUrl,
        value: MsgSetDenomMetadata.fromPartial({
          sender: 'sender',
          subspaceId: 1,
          metadata: Metadata.fromPartial({
            name: 'test',
            description: 'test coin',
            base: 'test',
            display: 'test',
            symbol: 'test',
            denomUnits: [{ denom: 'test', exponent: 0, aliases: ['test'] }],
          }),
        }),
      },
      {
        typeUrl: TokenFactory.v1.MsgUpdateParamsTypeUrl,
        value: MsgUpdateParams.fromPartial({
          params: {
            sendEnabled: [{ denom: 'test', enabled: true }],
            defaultSendEnabled: false,
          },
          authority: 'authority',
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
