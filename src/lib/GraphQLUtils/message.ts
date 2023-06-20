import { EncodeObject } from '@cosmjs/proto-signing';
import { GQLRawMessage, Message } from 'types/transactions';
import {
  MsgBeginRedelegateEncodeObject,
  MsgCreateValidatorEncodeObject,
  MsgDelegateEncodeObject,
  MsgDepositEncodeObject,
  MsgEditValidatorEncodeObject,
  MsgSendEncodeObject,
  MsgSubmitProposalEncodeObject,
  MsgTransferEncodeObject,
  MsgUndelegateEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@cosmjs/stargate';
import { TextProposal, VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import Long from 'long';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  FreeTextValueTypeUrl,
  GenericAuthorizationTypeUrl,
  GenericSubspaceAuthorizationTypeUrl,
  MediaTypeUrl,
  MsgAcceptDTagTransferRequestEncodeObject,
  MsgAcceptDTagTransferRequestTypeUrl,
  MsgAddPostAttachmentEncodeObject,
  MsgAddPostAttachmentTypeUrl,
  MsgAddReactionEncodeObject,
  MsgAddReactionTypeUrl,
  MsgAddReasonEncodeObject,
  MsgAddReasonTypeUrl,
  MsgAddRegisteredReactionEncodeObject,
  MsgAddRegisteredReactionTypeUrl,
  MsgAddUserToUserGroupEncodeObject,
  MsgAddUserToUserGroupTypeUrl,
  MsgAnswerPollEncodeObject,
  MsgAnswerPollTypeUrl,
  MsgBeginRedelegateTypeUrl,
  MsgBlockUserEncodeObject,
  MsgBlockUserTypeUrl,
  MsgCancelDTagTransferRequestEncodeObject,
  MsgCancelDTagTransferRequestTypeUrl,
  MsgCreatePostEncodeObject,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipEncodeObject,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportEncodeObject,
  MsgCreateReportTypeUrl,
  MsgCreateSectionEncodeObject,
  MsgCreateSectionTypeUrl,
  MsgCreateSubspaceEncodeObject,
  MsgCreateSubspaceTypeUrl,
  MsgCreateUserGroupEncodeObject,
  MsgCreateUserGroupTypeUrl,
  MsgCreateValidatorTypeUrl,
  MsgDelegateTypeUrl,
  MsgDeletePostEncodeObject,
  MsgDeletePostTypeUrl,
  MsgDeleteProfileEncodeObject,
  MsgDeleteProfileTypeUrl,
  MsgDeleteRelationshipEncodeObject,
  MsgDeleteRelationshipTypeUrl,
  MsgDeleteReportEncodeObject,
  MsgDeleteReportTypeUrl,
  MsgDeleteSectionEncodeObject,
  MsgDeleteSectionTypeUrl,
  MsgDeleteSubspaceEncodeObject,
  MsgDeleteSubspaceTypeUrl,
  MsgDeleteUserGroupEncodeObject,
  MsgDeleteUserGroupTypeUrl,
  MsgDepositTypeUrl,
  MsgEditPostEncodeObject,
  MsgEditPostTypeUrl,
  MsgEditRegisteredReactionEncodeObject,
  MsgEditRegisteredReactionTypeUrl,
  MsgEditSectionEncodeObject,
  MsgEditSectionTypeUrl,
  MsgEditSubspaceEncodeObject,
  MsgEditSubspaceTypeUrl,
  MsgEditUserGroupEncodeObject,
  MsgEditUserGroupTypeUrl,
  MsgEditValidatorTypeUrl,
  MsgGrantAllowanceEncodeObject,
  MsgGrantAllowanceTypeUrl,
  MsgGrantEncodeObject,
  MsgGrantTypeUrl,
  MsgLinkApplicationEncodeObject,
  MsgLinkApplicationTypeUrl,
  MsgLinkChainAccountEncodeObject,
  MsgLinkChainAccountTypeUrl,
  MsgMoveSectionEncodeObject,
  MsgMoveSectionTypeUrl,
  MsgMoveUserGroupEncodeObject,
  MsgMoveUserGroupTypeUrl,
  MsgRefuseDTagTransferRequestEncodeObject,
  MsgRefuseDTagTransferRequestTypeUrl,
  MsgRemovePostAttachmentEncodeObject,
  MsgRemovePostAttachmentTypeUrl,
  MsgRemoveReactionEncodeObject,
  MsgRemoveReactionTypeUrl,
  MsgRemoveReasonEncodeObject,
  MsgRemoveReasonTypeUrl,
  MsgRemoveRegisteredReactionEncodeObject,
  MsgRemoveRegisteredReactionTypeUrl,
  MsgRemoveUserFromUserGroupEncodeObject,
  MsgRemoveUserFromUserGroupTypeUrl,
  MsgRequestDTagTransferEncodeObject,
  MsgRequestDTagTransferTypeUrl,
  MsgRevokeAllowanceEncodeObject,
  MsgRevokeAllowanceTypeUrl,
  MsgRevokeEncodeObject,
  MsgRevokeTypeUrl,
  MsgSaveProfileEncodeObject,
  MsgSaveProfileTypeUrl,
  MsgSetReactionsParamsEncodeObject,
  MsgSetReactionsParamsTypeUrl,
  MsgSetUserGroupPermissionsEncodeObject,
  MsgSetUserGroupPermissionsTypeUrl,
  MsgSetUserPermissionsEncodeObject,
  MsgSetUserPermissionsTypeUrl,
  MsgSubmitProposalTypeUrl,
  MsgSupportStandardReasonEncodeObject,
  MsgSupportStandardReasonTypeUrl,
  MsgUnblockUserEncodeObject,
  MsgUnblockUserTypeUrl,
  MsgUndelegateTypeUrl,
  MsgUnlinkApplicationEncodeObject,
  MsgUnlinkApplicationTypeUrl,
  MsgUnlinkChainAccountEncodeObject,
  MsgUnlinkChainAccountTypeUrl,
  MsgVoteTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
  PeriodicAllowanceTypeUrl,
  PollTypeUrl,
  PostTargetTypeUrl,
  RegisteredReactionValueTypeUrl,
  SendAuthorizationTypeUrl,
  timestampFromDate,
  UserTargetTypeUrl,
} from '@desmoslabs/desmjs';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { PubKey as Secp256k1PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { PubKey as Ed25519PubKey } from 'cosmjs-types/cosmos/crypto/ed25519/keys';
import { MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {
  MsgAddUserToUserGroup,
  MsgCreateSection,
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
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { GenericSubspaceAuthorization } from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import { SendAuthorization } from 'cosmjs-types/cosmos/bank/v1beta1/authz';
import {
  authorizationTypeFromJSON,
  StakeAuthorization,
} from 'cosmjs-types/cosmos/staking/v1beta1/authz';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import {
  MsgFundCommunityPoolEncodeObject,
  MsgSetWithdrawAddressEncodeObject,
  MsgTransferTypeUrl,
  MsgWithdrawValidatorCommissionEncodeObject,
  StakeAuthorizationTypeUrl,
} from 'types/cosmos';
import { MsgGrantAllowance, MsgRevokeAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import {
  AllowedMsgAllowance,
  BasicAllowance,
  PeriodicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import {
  MsgAddPostAttachment,
  MsgAnswerPoll,
  MsgCreatePost,
  MsgDeletePost,
  MsgEditPost,
  MsgRemovePostAttachment,
} from '@desmoslabs/desmjs-types/desmos/posts/v3/msgs';
import {
  Attachment,
  Entities,
  Media,
  Poll,
  Poll_ProvidedAnswer,
  postReferenceTypeFromJSON,
  replySettingFromJSON,
  Url,
} from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
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
  MsgAddReason,
  MsgCreateReport,
  MsgDeleteReport,
  MsgRemoveReason,
  MsgSupportStandardReason,
} from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import { PostTarget, UserTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';
import {
  MsgFundCommunityPoolTypeUrl,
  MsgSetWithdrawAddressTypeUrl,
  MsgWithdrawValidatorCommissionTypeUrl,
} from '@desmoslabs/desmjs/build/const/cosmos/distribution';
import {
  CancelSoftwareUpgradeProposal,
  SoftwareUpgradeProposal,
} from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params';
import { CommunityPoolSpendProposal } from 'cosmjs-types/cosmos/distribution/v1beta1/distribution';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';

const decodePubKey = (gqlPubKey: any): Any | undefined => {
  const type = gqlPubKey['@type'];
  const { key } = gqlPubKey;

  if (type === '/cosmos.crypto.secp256k1.PubKey') {
    return Any.fromPartial({
      typeUrl: type,
      value: Secp256k1PubKey.encode(
        Secp256k1PubKey.fromPartial({
          key: Buffer.from(key, 'utf-8'),
        }),
      ).finish(),
    });
  }
  if (type === '/cosmos.crypto.ed25519.PubKey') {
    return Any.fromPartial({
      typeUrl: type,
      value: Ed25519PubKey.encode(
        Ed25519PubKey.fromPartial({
          key: Buffer.from(key, 'utf-8'),
        }),
      ).finish(),
    });
  }
  return {} as never;
};

const decodeProposalContent = (type: string, gqlContent: any): Any | undefined => {
  switch (type) {
    case '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal':
      return Any.fromPartial({
        typeUrl: type,
        value: SoftwareUpgradeProposal.encode(
          SoftwareUpgradeProposal.fromPartial({
            description: gqlContent.description,
            title: gqlContent.title,
            plan: gqlContent.plan,
          }),
        ).finish(),
      });
    case '/cosmos.params.v1beta1.ParameterChangeProposal':
      return Any.fromPartial({
        typeUrl: type,
        value: ParameterChangeProposal.encode(
          ParameterChangeProposal.fromPartial({
            title: gqlContent.title,
            description: gqlContent.description,
            changes: gqlContent.changes,
          }),
        ).finish(),
      });

    case '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal':
      return Any.fromPartial({
        typeUrl: type,
        value: CancelSoftwareUpgradeProposal.encode(
          CancelSoftwareUpgradeProposal.fromPartial({
            title: gqlContent.title,
            description: gqlContent.description,
          }),
        ).finish(),
      });

    case '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal':
      return Any.fromPartial({
        typeUrl: type,
        value: CommunityPoolSpendProposal.encode(
          CommunityPoolSpendProposal.fromPartial({
            title: gqlContent.title,
            description: gqlContent.description,
            amount: gqlContent.amount,
            recipient: gqlContent.recipient,
          }),
        ).finish(),
      });

    case '/cosmos.gov.v1beta1.TextProposal':
      return Any.fromPartial({
        typeUrl: type,
        value: TextProposal.encode(
          TextProposal.fromPartial({
            title: gqlContent.title,
            description: gqlContent.description,
          }),
        ).finish(),
      });

    default:
      return undefined;
  }
};

const decodeIbcMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgTransferTypeUrl:
      return {
        typeUrl: MsgTransferTypeUrl,
        value: MsgTransfer.fromPartial({
          token: value.token,
          memo: value.memo,
          sender: value.sender,
          receiver: value.receiver,
          sourcePort: value.source_port,
          sourceChannel: value.source_channel,
          timeoutHeight: {
            revisionHeight: value.timeoutHeight.revision_height,
            revisionNumber: value.timeoutHeight.revision_number,
          },
          timeoutTimestamp: Long.fromString(value.timeout_timestamp),
        }),
      } as MsgTransferEncodeObject;

    default:
      return undefined;
  }
};

const decodeBankMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case '/cosmos.bank.v1beta1.MsgSend':
      return {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          amount: value.amount,
          toAddress: value.to_address,
          fromAddress: value.from_address,
        },
      } as MsgSendEncodeObject;

    case '/cosmos.bank.v1beta1.MsgMultiSend':
      return {
        typeUrl: '/cosmos.bank.v1beta1.MsgMultiSend',
        value: {
          inputs: value.inputs,
          outputs: value.outputs,
        },
      } as EncodeObject;

    default:
      return undefined;
  }
};

const decodeDistributionMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgWithdrawDelegatorRewardTypeUrl:
      return {
        typeUrl: MsgWithdrawDelegatorRewardTypeUrl,
        value: {
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgWithdrawDelegatorRewardEncodeObject;

    case MsgSetWithdrawAddressTypeUrl:
      return {
        typeUrl: MsgSetWithdrawAddressTypeUrl,
        value: {
          delegatorAddress: value.delegator_address,
          withdrawAddress: value.withdraw_address,
        },
      } as MsgSetWithdrawAddressEncodeObject;

    case MsgWithdrawValidatorCommissionTypeUrl:
      return {
        typeUrl: MsgWithdrawValidatorCommissionTypeUrl,
        value: {
          validatorAddress: value.validator_address,
        },
      } as MsgWithdrawValidatorCommissionEncodeObject;

    case MsgFundCommunityPoolTypeUrl:
      return {
        typeUrl: MsgFundCommunityPoolTypeUrl,
        value: {
          amount: value.amount,
          depositor: value.depositor,
        },
      } as MsgFundCommunityPoolEncodeObject;

    default:
      return undefined;
  }
};

const decodeGovMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgVoteTypeUrl: {
      let voteOption: VoteOption;
      switch (value.option) {
        case 'VOTE_OPTION_YES':
          voteOption = VoteOption.VOTE_OPTION_YES;
          break;

        case 'VOTE_OPTION_ABSTAIN':
          voteOption = VoteOption.VOTE_OPTION_ABSTAIN;
          break;

        case 'VOTE_OPTION_NO':
          voteOption = VoteOption.VOTE_OPTION_NO;
          break;

        case 'VOTE_OPTION_NO_WITH_VETO':
          voteOption = VoteOption.VOTE_OPTION_NO_WITH_VETO;
          break;

        default:
          voteOption = VoteOption.VOTE_OPTION_UNSPECIFIED;
          break;
      }
      return {
        typeUrl: MsgVoteTypeUrl,
        value: {
          voter: value.voter,
          option: voteOption,
          proposalId: Long.fromString(value.proposal_id),
        },
      } as MsgVoteEncodeObject;
    }

    case MsgDepositTypeUrl:
      return {
        typeUrl: MsgDepositTypeUrl,
        value: {
          amount: value.amount,
          depositor: value.depositor,
          proposalId: Long.fromString(value.proposal_id),
        },
      } as MsgDepositEncodeObject;

    case MsgSubmitProposalTypeUrl:
      return {
        typeUrl: MsgSubmitProposalTypeUrl,
        value: {
          content: decodeProposalContent(value.content['@type'], value.content),
          initialDeposit: value.initial_deposit,
          proposer: value.proposer,
        },
      } as MsgSubmitProposalEncodeObject;

    default:
      return undefined;
  }
};

const decodeStakingMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgDelegateTypeUrl:
      return {
        typeUrl: MsgDelegateTypeUrl,
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgDelegateEncodeObject;

    case MsgBeginRedelegateTypeUrl:
      return {
        typeUrl: MsgBeginRedelegateTypeUrl,
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorSrcAddress: value.validator_src_address,
          validatorDstAddress: value.validator_dst_address,
        },
      } as MsgBeginRedelegateEncodeObject;

    case MsgUndelegateTypeUrl:
      return {
        typeUrl: MsgUndelegateTypeUrl,
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgUndelegateEncodeObject;

    case MsgCreateValidatorTypeUrl:
      return {
        typeUrl: MsgCreateValidatorTypeUrl,
        value: {
          value: value.value,
          pubkey: decodePubKey(value.pubkey),
          commission: {
            rate: value.commission.rate,
            maxRate: value.commission.maxRate,
            maxChangeRate: value.commission.max_change_rate,
          },
          description: {
            moniker: value.description.moniker,
            identity: value.description.identity,
            website: value.description.website,
            securityContact: value.description.security_contact,
            details: value.description.details,
          },
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
          minSelfDelegation: value.min_self_delegation,
        },
      } as MsgCreateValidatorEncodeObject;

    case MsgEditValidatorTypeUrl:
      return {
        typeUrl: MsgEditValidatorTypeUrl,
        value: {
          description: {
            moniker: value.description.moniker,
            identity: value.description.identity,
            website: value.description.website,
            securityContact: value.description.security_contact,
            details: value.description.details,
          },
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
          minSelfDelegation: value.min_self_delegation,
          commissionRate: value.commission_rate,
        },
      } as MsgEditValidatorEncodeObject;

    default:
      return undefined;
  }
};

const decodeProfileMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgSaveProfileTypeUrl:
      return {
        typeUrl: type,
        value: {
          dtag: value.dtag,
          nickname: value.nickname,
          bio: value.bio,
          coverPicture: value.cover_picture,
          profilePicture: value.profile_picture,
          creator: value.creator,
        },
      } as MsgSaveProfileEncodeObject;

    case MsgLinkChainAccountTypeUrl: {
      const chainAddress = value.chain_address;
      const chainConfig = value.chain_config;
      const { proof } = value;

      const chainAddressRaw = Bech32Address.encode({
        value: chainAddress.value,
        prefix: chainAddress.prefix,
      }).finish();

      return {
        typeUrl: MsgLinkChainAccountTypeUrl,
        value: {
          chainAddress: {
            typeUrl: chainAddress['@type'],
            value: chainAddressRaw,
          },
          chainConfig: {
            name: chainConfig.name,
          },
          signer: value.signer,
          proof: {
            plainText: proof.plain_text,
            signature: proof.signature,
            pubKey: decodePubKey(proof.pub_key),
          },
        },
      } as MsgLinkChainAccountEncodeObject;
    }

    case MsgUnlinkChainAccountTypeUrl:
      return {
        typeUrl: type,
        value: {
          target: value.target,
          owner: value.owner,
          chainName: value.chain_name,
        },
      } as MsgUnlinkChainAccountEncodeObject;

    case MsgAcceptDTagTransferRequestTypeUrl:
      return {
        typeUrl: MsgAcceptDTagTransferRequestTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
          newDtag: value.new_dtag,
        },
      } as MsgAcceptDTagTransferRequestEncodeObject;

    case MsgCancelDTagTransferRequestTypeUrl:
      return {
        typeUrl: MsgCancelDTagTransferRequestTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
        },
      } as MsgCancelDTagTransferRequestEncodeObject;

    case MsgDeleteProfileTypeUrl:
      return {
        typeUrl: MsgDeleteProfileTypeUrl,
        value: {
          creator: value.creator,
        },
      } as MsgDeleteProfileEncodeObject;

    case MsgLinkApplicationTypeUrl:
      return {
        typeUrl: MsgLinkApplicationTypeUrl,
        value: {
          sender: value.sender,
          linkData: {
            application: value.link_data.application,
            username: value.link_data.username,
          },
          timeoutTimestamp: Long.fromString(value.timeout_timestamp),
          timeoutHeight: {
            revisionHeight: Long.fromString(value.timeout_height.revision_height),
            revisionNumber: Long.fromString(value.timeout_height.revision_number),
          },
          sourcePort: value.source_port,
          sourceChannel: value.source_channel,
          callData: value.call_data,
        },
      } as MsgLinkApplicationEncodeObject;

    case MsgRefuseDTagTransferRequestTypeUrl:
      return {
        typeUrl: MsgRefuseDTagTransferRequestTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
        },
      } as MsgRefuseDTagTransferRequestEncodeObject;

    case MsgRequestDTagTransferTypeUrl:
      return {
        typeUrl: MsgRequestDTagTransferTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
        },
      } as MsgRequestDTagTransferEncodeObject;

    case MsgUnlinkApplicationTypeUrl:
      return {
        typeUrl: MsgUnlinkApplicationTypeUrl,
        value: {
          signer: value.signer,
          username: value.username,
          application: value.application,
        },
      } as MsgUnlinkApplicationEncodeObject;

    default:
      return undefined;
  }
};

const decodeGrant = (grant: any): Grant | undefined => {
  if (grant === undefined || grant === null) {
    return undefined;
  }

  const { authorization, expiration } = grant;
  const parsedExpiration = expiration ? timestampFromDate(new Date(expiration)) : undefined;
  const authorizationType = authorization['@type'];
  let decodedAuthorization: Any | undefined;

  switch (authorizationType) {
    case GenericSubspaceAuthorizationTypeUrl:
      decodedAuthorization = {
        typeUrl: authorizationType,
        value: GenericSubspaceAuthorization.encode(
          GenericSubspaceAuthorization.fromPartial({
            msg: authorization.msg,
            subspacesIds: authorization.subspaces_ids,
          }),
        ).finish(),
      };
      break;

    case GenericAuthorizationTypeUrl:
      decodedAuthorization = {
        typeUrl: GenericAuthorizationTypeUrl,
        value: GenericAuthorization.encode(
          GenericAuthorization.fromPartial({
            msg: authorization.msg,
          }),
        ).finish(),
      };
      break;

    case SendAuthorizationTypeUrl:
      decodedAuthorization = {
        typeUrl: SendAuthorizationTypeUrl,
        value: SendAuthorization.encode(
          SendAuthorization.fromPartial({
            spendLimit: authorization.spend_limit.map(Coin.fromJSON),
          }),
        ).finish(),
      };
      break;

    case StakeAuthorizationTypeUrl:
      decodedAuthorization = {
        typeUrl: StakeAuthorizationTypeUrl,
        value: StakeAuthorization.encode(
          StakeAuthorization.fromPartial({
            authorizationType: authorizationTypeFromJSON(authorization.authorization_type),
            allowList: authorization.allow_list,
            denyList: authorization.deny_list,
            maxTokens: authorization.max_tokens,
          }),
        ).finish(),
      };
      break;

    default:
      // Disable eslint so that we have the warning when in development mode.
      // eslint-disable-next-line no-console
      console.warn('Unsupported authorization type', authorizationType);
      decodedAuthorization = Any.fromPartial({
        typeUrl: authorizationType,
      });
      break;
  }

  return Grant.fromPartial({
    authorization: decodedAuthorization,
    expiration: parsedExpiration,
  });
};

const decodeAuthzMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgGrantTypeUrl:
      return {
        typeUrl: MsgGrantTypeUrl,
        value: MsgGrant.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
          grant: decodeGrant(value.grant),
        }),
      } as MsgGrantEncodeObject;

    case MsgRevokeTypeUrl:
      return {
        typeUrl: MsgRevokeTypeUrl,
        value: MsgRevoke.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
          msgTypeUrl: value.msg_type_url,
        }),
      } as MsgRevokeEncodeObject;
    default:
      return undefined;
  }
};

const decodeAllowance = (allowance: any): Any | undefined => {
  if (allowance === undefined || allowance === null) {
    return undefined;
  }

  const allowanceType = allowance['@type'];

  switch (allowanceType) {
    case BasicAllowanceTypeUrl:
      return Any.fromPartial({
        typeUrl: BasicAllowanceTypeUrl,
        value: BasicAllowance.encode(
          BasicAllowance.fromPartial({
            expiration: allowance.expiration
              ? timestampFromDate(new Date(allowance.expiration))
              : undefined,
            spendLimit: allowance.spend_limit,
          }),
        ).finish(),
      });

    case PeriodicAllowanceTypeUrl:
      return Any.fromPartial({
        typeUrl: PeriodicAllowanceTypeUrl,
        value: PeriodicAllowance.encode(
          PeriodicAllowance.fromPartial({
            basic: BasicAllowance.fromPartial({
              expiration: allowance.basic.expiration
                ? timestampFromDate(new Date(allowance.basic.expiration))
                : undefined,
              spendLimit: allowance.basic.spend_limit,
            }),
            periodReset: allowance.period_reset
              ? timestampFromDate(new Date(allowance.period_reset))
              : undefined,
            period: allowance.period
              ? {
                  seconds: allowance.period.replace('s', ''),
                  nanos: 0,
                }
              : undefined,
            periodSpendLimit: allowance.period_spend_limit,
            periodCanSpend: allowance.period_can_spend,
          }),
        ).finish(),
      });

    case AllowedMsgAllowanceTypeUrl:
      return Any.fromPartial({
        typeUrl: AllowedMsgAllowanceTypeUrl,
        value: AllowedMsgAllowance.encode(
          AllowedMsgAllowance.fromPartial({
            allowance: decodeAllowance(allowance.allowance),
            allowedMessages: allowance.allowed_messages,
          }),
        ).finish(),
      });
    default:
      // Keep this console log for debug purpose.
      // eslint-disable-next-line no-console
      console.log('Unsupported allowance type', allowanceType);
      return undefined;
  }
};

const decodeFeeGrantMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgGrantAllowanceTypeUrl:
      return {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
          allowance: decodeAllowance(value.allowance),
        }),
      } as MsgGrantAllowanceEncodeObject;

    case MsgRevokeAllowanceTypeUrl:
      return {
        typeUrl: MsgRevokeAllowanceTypeUrl,
        value: MsgRevokeAllowance.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
        }),
      } as MsgRevokeAllowanceEncodeObject;
    default:
      return undefined;
  }
};

const decodeSubspaceMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgEditSubspaceTypeUrl:
      return {
        typeUrl: MsgEditSubspaceTypeUrl,
        value: MsgEditSubspace.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          name: value.name,
          description: value.description,
          owner: value.owner,
          signer: value.signer,
        }),
      } as MsgEditSubspaceEncodeObject;

    case MsgDeleteSubspaceTypeUrl:
      return {
        typeUrl: MsgDeleteSubspaceTypeUrl,
        value: MsgDeleteSubspace.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          signer: value.signer,
        }),
      } as MsgDeleteSubspaceEncodeObject;

    case MsgCreateSectionTypeUrl:
      return {
        typeUrl: MsgCreateSectionTypeUrl,
        value: MsgCreateSection.fromPartial({
          name: value.name,
          description: value.description,
          parentId: value.parent_id,
          subspaceId: Long.fromString(value.subspace_id),
          creator: value.creator,
        }),
      } as MsgCreateSectionEncodeObject;

    case MsgEditSectionTypeUrl:
      return {
        typeUrl: MsgEditSectionTypeUrl,
        value: MsgEditSection.fromPartial({
          name: value.name,
          description: value.description,
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          editor: value.editor,
        }),
      } as MsgEditSectionEncodeObject;

    case MsgMoveSectionTypeUrl:
      return {
        typeUrl: MsgMoveSectionTypeUrl,
        value: MsgMoveSection.fromPartial({
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          newParentId: value.new_parent_id,
          signer: value.signer,
        }),
      } as MsgMoveSectionEncodeObject;

    case MsgDeleteSectionTypeUrl:
      return {
        typeUrl: MsgDeleteSectionTypeUrl,
        value: MsgDeleteSection.fromPartial({
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          signer: value.signer,
        }),
      } as MsgDeleteSectionEncodeObject;

    case MsgCreateUserGroupTypeUrl:
      return {
        typeUrl: MsgCreateUserGroupTypeUrl,
        value: MsgCreateUserGroup.fromPartial({
          name: value.name,
          description: value.description,
          creator: value.creator,
          initialMembers: value.initial_members,
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          defaultPermissions: value.default_permissions,
        }),
      } as MsgCreateUserGroupEncodeObject;

    case MsgEditUserGroupTypeUrl:
      return {
        typeUrl: MsgEditUserGroupTypeUrl,
        value: MsgEditUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          name: value.name,
          description: value.description,
          signer: value.signer,
        }),
      } as MsgEditUserGroupEncodeObject;

    case MsgMoveUserGroupTypeUrl:
      return {
        typeUrl: MsgMoveUserGroupTypeUrl,
        value: MsgMoveUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          newSectionId: value.new_section_id,
          signer: value.signer,
        }),
      } as MsgMoveUserGroupEncodeObject;

    case MsgSetUserGroupPermissionsTypeUrl:
      return {
        typeUrl: MsgSetUserGroupPermissionsTypeUrl,
        value: MsgSetUserGroupPermissions.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          permissions: value.permissions,
          signer: value.signer,
        }),
      } as MsgSetUserGroupPermissionsEncodeObject;

    case MsgDeleteUserGroupTypeUrl:
      return {
        typeUrl: MsgDeleteUserGroupTypeUrl,
        value: MsgDeleteUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          signer: value.signer,
        }),
      } as MsgDeleteUserGroupEncodeObject;

    case MsgAddUserToUserGroupTypeUrl:
      return {
        typeUrl: MsgAddUserToUserGroupTypeUrl,
        value: MsgAddUserToUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          user: value.user,
          signer: value.signer,
        }),
      } as MsgAddUserToUserGroupEncodeObject;

    case MsgRemoveUserFromUserGroupTypeUrl:
      return {
        typeUrl: MsgRemoveUserFromUserGroupTypeUrl,
        value: MsgRemoveUserFromUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          user: value.user,
          signer: value.signer,
        }),
      } as MsgRemoveUserFromUserGroupEncodeObject;

    case MsgSetUserPermissionsTypeUrl:
      return {
        typeUrl: MsgSetUserPermissionsTypeUrl,
        value: MsgSetUserPermissions.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          sectionId: value.section_id ?? 0,
          user: value.user,
          permissions: value.permissions,
          signer: value.signer,
        }),
      } as MsgSetUserPermissionsEncodeObject;

    case MsgCreateSubspaceTypeUrl:
      return {
        typeUrl: MsgCreateSubspaceTypeUrl,
        value: {
          name: value.name,
          description: value.description,
          owner: value.owner,
          creator: value.creator,
        },
      } as MsgCreateSubspaceEncodeObject;

    default:
      return undefined;
  }
};

const decodeAttachmentContent = (attachment: any): Any | undefined => {
  if (attachment === undefined || attachment === null) {
    return undefined;
  }

  const attachmentType = attachment['@type'];
  switch (attachmentType) {
    case PollTypeUrl:
      return {
        typeUrl: PollTypeUrl,
        value: Poll.encode(
          Poll.fromPartial({
            endDate: timestampFromDate(new Date(attachment.end_date)),
            question: attachment.question,
            allowsAnswerEdits: attachment.allows_answer_edits,
            allowsMultipleAnswers: attachment.allows_multiple_answers,
            finalTallyResults: attachment.final_tally_results
              ? {
                  results: attachment.final_tally_results.results?.map((result: any) => ({
                    answerIndex: result.answer_index,
                    votes: result.votes,
                  })),
                }
              : undefined,
            providedAnswers: attachment.provided_answers?.map(
              (answer: any) =>
                ({
                  text: answer.text,
                  attachments: answer.attachments?.map(
                    (a: any) =>
                      ({
                        subspaceId: a.subspace_id,
                        postId: a.post_id,
                        id: a.id,
                        content: decodeAttachmentContent(a.content),
                      } as Attachment),
                  ),
                } as Poll_ProvidedAnswer),
            ),
          }),
        ).finish(),
      } as Any;

    case MediaTypeUrl:
      return {
        typeUrl: MediaTypeUrl,
        value: Media.encode(
          Media.fromPartial({
            uri: attachment.uri,
            mimeType: attachment.mime_type,
          }),
        ).finish(),
      } as Any;

    default:
      // Keep this console log for debug purpose.
      // eslint-disable-next-line no-console
      console.log('Unsupported attachment type', attachmentType);
      return undefined;
  }
};

const decodeEntities = (entities: any): Entities | undefined => {
  if (entities === undefined || entities === null) {
    return undefined;
  }

  return Entities.fromPartial({
    hashtags: entities.hashtags,
    mentions: entities.mentions,
    urls: entities.urls?.map(
      (url: any) =>
        ({
          start: url.start,
          end: url.end,
          url: url.url,
          displayUrl: url.display_url,
        } as Url),
    ),
  });
};

const decodePostsMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgCreatePostTypeUrl:
      return {
        typeUrl: MsgCreatePostTypeUrl,
        value: MsgCreatePost.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          sectionId: value.section_id,
          externalId: value.external_id,
          text: value.text,
          tags: value.tags,
          author: value.author,
          conversationId: Long.fromString(value.conversation_id),
          replySettings: value.reply_settings
            ? replySettingFromJSON(value.reply_settings)
            : undefined,
          referencedPosts: value.referenced_posts.map((rp: any) => ({
            type: rp?.type ? postReferenceTypeFromJSON(rp.type) : undefined,
            postId: rp?.post_id,
            position: rp?.position,
          })),
          entities: decodeEntities(value.entities),

          attachments: value.attachments
            ?.map(decodeAttachmentContent)
            ?.filter((attachment: Any | undefined) => attachment !== undefined),
        }),
      } as MsgCreatePostEncodeObject;

    case MsgEditPostTypeUrl:
      return {
        typeUrl: MsgEditPostTypeUrl,
        value: MsgEditPost.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          text: value.text,
          tags: value.tags,
          entities: decodeEntities(value.entities),
          editor: value.editor,
        }),
      } as MsgEditPostEncodeObject;

    case MsgDeletePostTypeUrl:
      return {
        typeUrl: MsgDeletePostTypeUrl,
        value: MsgDeletePost.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          signer: value.signer,
        }),
      } as MsgDeletePostEncodeObject;

    case MsgAddPostAttachmentTypeUrl:
      return {
        typeUrl: MsgAddPostAttachmentTypeUrl,
        value: MsgAddPostAttachment.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          content: decodeAttachmentContent(value.content),
          editor: value.editor,
        }),
      } as MsgAddPostAttachmentEncodeObject;

    case MsgRemovePostAttachmentTypeUrl:
      return {
        typeUrl: MsgRemovePostAttachmentTypeUrl,
        value: MsgRemovePostAttachment.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          attachmentId: value.attachment_id,
          editor: value.editor,
        }),
      } as MsgRemovePostAttachmentEncodeObject;

    case MsgAnswerPollTypeUrl:
      return {
        typeUrl: MsgAnswerPollTypeUrl,
        value: MsgAnswerPoll.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          pollId: value.poll_id,
          answersIndexes: value.answers_indexes,
          signer: value.signer,
        }),
      } as MsgAnswerPollEncodeObject;

    default:
      return undefined;
  }
};

const decodeReactionValue = (value: any): Any | undefined => {
  if (value === undefined || value === null) {
    return value;
  }

  const valueType = value['@type'];

  switch (valueType) {
    case RegisteredReactionValueTypeUrl:
      return Any.fromPartial({
        typeUrl: RegisteredReactionValueTypeUrl,
        value: RegisteredReactionValue.encode(
          RegisteredReactionValue.fromPartial({
            registeredReactionId: value.registered_reaction_id,
          }),
        ).finish(),
      });

    case FreeTextValueTypeUrl:
      return Any.fromPartial({
        typeUrl: FreeTextValueTypeUrl,
        value: FreeTextValue.encode(
          FreeTextValue.fromPartial({
            text: value.text,
          }),
        ).finish(),
      });

    default:
      // Keep this console log for debug purpose.
      // eslint-disable-next-line no-console
      console.log('Unsupported reaction value type', valueType);
      return undefined;
  }
};

const decodeReactionsMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgAddReactionTypeUrl:
      return {
        typeUrl: MsgAddReactionTypeUrl,
        value: MsgAddReaction.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          value: decodeReactionValue(value.value),
          user: value.user,
        }),
      } as MsgAddReactionEncodeObject;

    case MsgRemoveReactionTypeUrl:
      return {
        typeUrl: MsgRemoveReactionTypeUrl,
        value: MsgRemoveReaction.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          reactionId: value.reaction_id,
          user: value.user,
        }),
      } as MsgRemoveReactionEncodeObject;

    case MsgAddRegisteredReactionTypeUrl:
      return {
        typeUrl: MsgAddRegisteredReactionTypeUrl,
        value: MsgAddRegisteredReaction.fromPartial({
          subspaceId: value.subspace_id,
          displayValue: value.display_value,
          shorthandCode: value.shorthand_code,
          user: value.user,
        }),
      } as MsgAddRegisteredReactionEncodeObject;

    case MsgEditRegisteredReactionTypeUrl:
      return {
        typeUrl: MsgEditRegisteredReactionTypeUrl,
        value: MsgEditRegisteredReaction.fromPartial({
          subspaceId: value.subspace_id,
          registeredReactionId: value.registered_reaction_id,
          shorthandCode: value.shorthand_code,
          displayValue: value.display_value,
          user: value.user,
        }),
      } as MsgEditRegisteredReactionEncodeObject;

    case MsgRemoveRegisteredReactionTypeUrl:
      return {
        typeUrl: MsgRemoveRegisteredReactionTypeUrl,
        value: MsgRemoveRegisteredReaction.fromPartial({
          subspaceId: value.subspace_id,
          registeredReactionId: value.registered_reaction_id,
          user: value.user,
        }),
      } as MsgRemoveRegisteredReactionEncodeObject;

    case MsgSetReactionsParamsTypeUrl:
      return {
        typeUrl: MsgSetReactionsParamsTypeUrl,
        value: MsgSetReactionsParams.fromPartial({
          subspaceId: value.subspace_id,
          registeredReaction: value.registered_reaction,
          freeText: value.free_text
            ? {
                enabled: value.free_text.enabled,
                regEx: value.free_text.reg_ex,
                maxLength: value.free_text.max_length,
              }
            : undefined,
          user: value.user,
        }),
      } as MsgSetReactionsParamsEncodeObject;

    default:
      return undefined;
  }
};

const decodeRelationshipMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgBlockUserTypeUrl:
      return {
        typeUrl: MsgBlockUserTypeUrl,
        value: {
          subspaceId: Long.fromString(value.subspace_id),
          blocked: value.blocked,
          blocker: value.blocker,
          reason: value.reason,
        },
      } as MsgBlockUserEncodeObject;

    case MsgCreateRelationshipTypeUrl:
      return {
        typeUrl: MsgCreateRelationshipTypeUrl,
        value: {
          signer: value.signer,
          subspaceId: Long.fromString(value.subspace_id),
          counterparty: value.counterparty,
        },
      } as MsgCreateRelationshipEncodeObject;

    case MsgDeleteRelationshipTypeUrl:
      return {
        typeUrl: MsgDeleteRelationshipTypeUrl,
        value: {
          signer: value.signer,
          subspaceId: Long.fromString(value.subspace_id),
          counterparty: value.counterparty,
        },
      } as MsgDeleteRelationshipEncodeObject;

    case MsgUnblockUserTypeUrl:
      return {
        typeUrl: MsgUnblockUserTypeUrl,
        value: {
          subspaceId: Long.fromString(value.subspace_id),
          blocked: value.blocked,
          blocker: value.blocker,
        },
      } as MsgUnblockUserEncodeObject;

    default:
      return undefined;
  }
};

const decodeReportTarget = (target: any): Any | undefined => {
  const type = target['@type'];

  switch (type) {
    case PostTargetTypeUrl:
      return Any.fromPartial({
        typeUrl: PostTargetTypeUrl,
        value: PostTarget.encode(
          PostTarget.fromPartial({
            postId: target.post_id,
          }),
        ).finish(),
      });

    case UserTargetTypeUrl:
      return Any.fromPartial({
        typeUrl: UserTargetTypeUrl,
        value: UserTarget.encode(
          UserTarget.fromPartial({
            user: target.user,
          }),
        ).finish(),
      });

    default:
      // Keep this console log for debug purpose.
      // eslint-disable-next-line no-console
      console.log('unsupported report target type', type);
      return undefined;
  }
};

const decodeReportsMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case MsgCreateReportTypeUrl:
      return {
        typeUrl: MsgCreateReportTypeUrl,
        value: MsgCreateReport.fromPartial({
          subspaceId: value.subspace_id,
          message: value.message,
          reporter: value.reporter,
          reasonsIds: value.reasons_ids,
          target: decodeReportTarget(value.target),
        }),
      } as MsgCreateReportEncodeObject;

    case MsgDeleteReportTypeUrl:
      return {
        typeUrl: MsgDeleteReportTypeUrl,
        value: MsgDeleteReport.fromPartial({
          subspaceId: value.subspace_id,
          reportId: value.report_id,
          signer: value.signer,
        }),
      } as MsgDeleteReportEncodeObject;

    case MsgSupportStandardReasonTypeUrl:
      return {
        typeUrl: MsgSupportStandardReasonTypeUrl,
        value: MsgSupportStandardReason.fromPartial({
          subspaceId: value.subspace_id,
          standardReasonId: value.standard_reason_id,
          signer: value.signer,
        }),
      } as MsgSupportStandardReasonEncodeObject;

    case MsgAddReasonTypeUrl:
      return {
        typeUrl: MsgAddReasonTypeUrl,
        value: MsgAddReason.fromPartial({
          subspaceId: value.subspace_id,
          description: value.description,
          title: value.title,
          signer: value.signer,
        }),
      } as MsgAddReasonEncodeObject;

    case MsgRemoveReasonTypeUrl:
      return {
        typeUrl: MsgRemoveReasonTypeUrl,
        value: MsgRemoveReason.fromPartial({
          subspaceId: value.subspace_id,
          reasonId: value.reason_id,
          signer: value.signer,
        }),
      } as MsgRemoveReasonEncodeObject;

    default:
      return undefined;
  }
};

const converters = [
  decodeAuthzMessage,
  decodeBankMessage,
  decodeDistributionMessage,
  decodeFeeGrantMessage,
  decodeGovMessage,
  decodeIbcMessage,
  decodePostsMessage,
  decodeProfileMessage,
  decodeReactionsMessage,
  decodeReportsMessage,
  decodeStakingMessage,
  decodeSubspaceMessage,
];

const decodeGqlRawMessage = (message: GQLRawMessage): Message => {
  const type = message['@type'].startsWith('/') ? message['@type'] : `/${message['@type']}`;

  let converted: EncodeObject | undefined;
  for (let i = 0; i < converters.length; i += 1) {
    converted = converters[i](type, message);
    if (converted) break;
  }

  // console.warn('Unsupported message type while parsing tx from GraphQL', type, message);
  return (
    converted ?? {
      typeUrl: type,
      value: message,
    }
  );
};

export default decodeGqlRawMessage;
