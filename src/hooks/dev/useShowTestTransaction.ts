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
  MsgAnswerPollTypeUrl,
  MsgCancelDTagTransferRequestTypeUrl,
  MsgCreatePostTypeUrl,
  MsgDeletePostTypeUrl,
  MsgDeleteProfileTypeUrl,
  MsgDepositTypeUrl,
  MsgEditPostTypeUrl,
  MsgFundCommunityPoolTypeUrl,
  MsgGrantAllowanceTypeUrl,
  MsgGrantTypeUrl,
  MsgLinkApplicationTypeUrl,
  MsgLinkChainAccountTypeUrl,
  MsgMultiSendTypeUrl,
  MsgRefuseDTagTransferRequestTypeUrl,
  MsgRemovePostAttachmentTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgRequestDTagTransferTypeUrl,
  MsgRevokeAllowanceTypeUrl,
  MsgRevokeTypeUrl,
  MsgSaveProfileTypeUrl,
  MsgSendTypeUrl,
  MsgSetReactionsParamsTypeUrl,
  MsgSetWithdrawAddressTypeUrl,
  MsgSubmitProposalTypeUrl,
  MsgUnlinkApplicationTypeUrl,
  MsgUnlinkChainAccountTypeUrl,
  MsgVoteTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
  MsgWithdrawValidatorCommissionTypeUrl,
  PeriodicAllowanceTypeUrl,
  PollTypeUrl,
  RegisteredReactionValueTypeUrl,
  timestampFromDate,
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
