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
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import Long from 'long';
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
  MsgSoftwareUpgradeEncodeObject,
  MsgSoftwareUpgradeTypeUrl,
  MsgTransferTypeUrl,
  MsgUpdateStakingModuleParamsEncodeObject,
  MsgUpdateStakingModuleParamsTypeUrl,
  MsgWithdrawValidatorCommissionEncodeObject,
  SoftwareUpgradeProposalEncodeObject,
  SoftwareUpgradeProposalTypeUrl,
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
  CancelSoftwareUpgradeProposal,
  SoftwareUpgradeProposal,
} from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params';
import { CommunityPoolSpendProposal } from 'cosmjs-types/cosmos/distribution/v1beta1/distribution';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { MsgSoftwareUpgrade } from '@desmoslabs/desmjs-types/cosmos/upgrade/v1beta1/tx';
import { voteOptionFromJSON as voteOptionV1FromJSON } from '@desmoslabs/desmjs-types/cosmos/gov/v1/gov';
import {
  MsgDeposit as MsgDepositV1,
  MsgSubmitProposal as MsgSubmitProposalV1,
  MsgVote as MsgVoteV1,
} from '@desmoslabs/desmjs-types/cosmos/gov/v1/tx';
import { voteOptionFromJSON as voteOptionV1Beat1FromJSON } from '@desmoslabs/desmjs-types/cosmos/gov/v1beta1/gov';

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
    case Distribution.v1beta1.MsgWithdrawDelegatorRewardTypeUrl:
      return {
        typeUrl: Distribution.v1beta1.MsgWithdrawDelegatorRewardTypeUrl,
        value: {
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgWithdrawDelegatorRewardEncodeObject;

    case Distribution.v1beta1.MsgSetWithdrawAddressTypeUrl:
      return {
        typeUrl: Distribution.v1beta1.MsgSetWithdrawAddressTypeUrl,
        value: {
          delegatorAddress: value.delegator_address,
          withdrawAddress: value.withdraw_address,
        },
      } as MsgSetWithdrawAddressEncodeObject;

    case Distribution.v1beta1.MsgWithdrawValidatorCommissionTypeUrl:
      return {
        typeUrl: Distribution.v1beta1.MsgWithdrawValidatorCommissionTypeUrl,
        value: {
          validatorAddress: value.validator_address,
        },
      } as MsgWithdrawValidatorCommissionEncodeObject;

    case Distribution.v1beta1.MsgFundCommunityPoolTypeUrl:
      return {
        typeUrl: Distribution.v1beta1.MsgFundCommunityPoolTypeUrl,
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
    // v1
    case Gov.v1.MsgVoteTypeUrl:
      return {
        typeUrl: Gov.v1.MsgVoteTypeUrl,
        value: MsgVoteV1.fromPartial({
          option: voteOptionV1FromJSON(value.option),
          voter: value.voter,
          proposalId: value.proposal_id,
          metadata: value.metadata,
        }),
      } as Gov.v1.MsgVoteEncodeObject;

    case Gov.v1.MsgDepositTypeUrl:
      return {
        typeUrl: Gov.v1.MsgDepositTypeUrl,
        value: MsgDepositV1.fromPartial({
          proposalId: value.proposal_id,
          amount: value.amount,
          depositor: value.depositor,
        }),
      } as Gov.v1.MsgDepositEncodeObject;

    case Gov.v1.MsgSubmitProposalTypeUrl:
      return {
        typeUrl: Gov.v1.MsgSubmitProposalTypeUrl,
        value: MsgSubmitProposalV1.fromPartial({
          // TODO: handle recursive types.
          messages: [],
          metadata: value.metadata,
          title: value.title,
          proposer: value.proposer,
          summary: value.summary,
          initialDeposit: value.initial_deposit,
        }),
      } as Gov.v1.MsgSubmitProposalEncodeObject;

    // v1beta1
    case Gov.v1beta1.MsgVoteTypeUrl: {
      return {
        typeUrl: Gov.v1beta1.MsgVoteTypeUrl,
        value: {
          voter: value.voter,
          option: voteOptionV1Beat1FromJSON(value.option),
          proposalId: Long.fromString(value.proposal_id),
        },
      } as MsgVoteEncodeObject;
    }

    case Gov.v1beta1.MsgDepositTypeUrl:
      return {
        typeUrl: Gov.v1beta1.MsgDepositTypeUrl,
        value: {
          amount: value.amount,
          depositor: value.depositor,
          proposalId: Long.fromString(value.proposal_id),
        },
      } as MsgDepositEncodeObject;

    case Gov.v1beta1.MsgSubmitProposalTypeUrl:
      return {
        typeUrl: Gov.v1beta1.MsgSubmitProposalTypeUrl,
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
    case Staking.v1beta1.MsgDelegateTypeUrl:
      return {
        typeUrl: Staking.v1beta1.MsgDelegateTypeUrl,
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgDelegateEncodeObject;

    case Staking.v1beta1.MsgBeginRedelegateTypeUrl:
      return {
        typeUrl: Staking.v1beta1.MsgBeginRedelegateTypeUrl,
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorSrcAddress: value.validator_src_address,
          validatorDstAddress: value.validator_dst_address,
        },
      } as MsgBeginRedelegateEncodeObject;

    case Staking.v1beta1.MsgUndelegateTypeUrl:
      return {
        typeUrl: Staking.v1beta1.MsgUndelegateTypeUrl,
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgUndelegateEncodeObject;

    case Staking.v1beta1.MsgCreateValidatorTypeUrl:
      return {
        typeUrl: Staking.v1beta1.MsgCreateValidatorTypeUrl,
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

    case Staking.v1beta1.MsgEditValidatorTypeUrl:
      return {
        typeUrl: Staking.v1beta1.MsgEditValidatorTypeUrl,
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

    case MsgUpdateStakingModuleParamsTypeUrl:
      return {
        typeUrl: MsgUpdateStakingModuleParamsTypeUrl,
        value: {
          params: {
            bondDenom: value.params.bond_denom,
            maxEntries: value.params.max_entries,
            maxValidators: value.params.max_validators,
            unbondingTime: value.params.unbonding_time,
            historicalEntries: value.params.historical_entries,
            minCommissionRate: value.params.min_commission_rate,
          },
          authority: value.authority,
        },
      } as MsgUpdateStakingModuleParamsEncodeObject;

    default:
      return undefined;
  }
};

const decodeProfileMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case Profiles.v3.MsgSaveProfileTypeUrl:
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
      } as Profiles.v3.MsgSaveProfileEncodeObject;

    case Profiles.v3.MsgLinkChainAccountTypeUrl: {
      const chainAddress = value.chain_address;
      const chainConfig = value.chain_config;
      const { proof } = value;

      const chainAddressRaw = Bech32Address.encode({
        value: chainAddress.value,
        prefix: chainAddress.prefix,
      }).finish();

      return {
        typeUrl: Profiles.v3.MsgLinkChainAccountTypeUrl,
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
      } as Profiles.v3.MsgLinkChainAccountEncodeObject;
    }

    case Profiles.v3.MsgUnlinkChainAccountTypeUrl:
      return {
        typeUrl: type,
        value: {
          target: value.target,
          owner: value.owner,
          chainName: value.chain_name,
        },
      } as Profiles.v3.MsgUnlinkChainAccountEncodeObject;

    case Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
          newDtag: value.new_dtag,
        },
      } as Profiles.v3.MsgAcceptDTagTransferRequestEncodeObject;

    case Profiles.v3.MsgCancelDTagTransferRequestTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgCancelDTagTransferRequestTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
        },
      } as Profiles.v3.MsgCancelDTagTransferRequestEncodeObject;

    case Profiles.v3.MsgDeleteProfileTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgDeleteProfileTypeUrl,
        value: {
          creator: value.creator,
        },
      } as Profiles.v3.MsgDeleteProfileEncodeObject;

    case Profiles.v3.MsgLinkApplicationTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgLinkApplicationTypeUrl,
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
      } as Profiles.v3.MsgLinkApplicationEncodeObject;

    case Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
        },
      } as Profiles.v3.MsgRefuseDTagTransferRequestEncodeObject;

    case Profiles.v3.MsgRequestDTagTransferTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgRequestDTagTransferTypeUrl,
        value: {
          sender: value.sender,
          receiver: value.receiver,
        },
      } as Profiles.v3.MsgRequestDTagTransferEncodeObject;

    case Profiles.v3.MsgUnlinkApplicationTypeUrl:
      return {
        typeUrl: Profiles.v3.MsgUnlinkApplicationTypeUrl,
        value: {
          signer: value.signer,
          username: value.username,
          application: value.application,
        },
      } as Profiles.v3.MsgUnlinkApplicationEncodeObject;

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
    case Subspaces.v3.GenericSubspaceAuthorizationTypeUrl:
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

    case Authz.v1beta1.GenericAuthorizationTypeUrl:
      decodedAuthorization = {
        typeUrl: Authz.v1beta1.GenericAuthorizationTypeUrl,
        value: GenericAuthorization.encode(
          GenericAuthorization.fromPartial({
            msg: authorization.msg,
          }),
        ).finish(),
      };
      break;

    case Bank.v1beta1.SendAuthorizationTypeUrl:
      decodedAuthorization = {
        typeUrl: Bank.v1beta1.SendAuthorizationTypeUrl,
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
    case Authz.v1beta1.MsgGrantTypeUrl:
      return {
        typeUrl: Authz.v1beta1.MsgGrantTypeUrl,
        value: MsgGrant.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
          grant: decodeGrant(value.grant),
        }),
      } as Authz.v1beta1.MsgGrantEncodeObject;

    case Authz.v1beta1.MsgRevokeTypeUrl:
      return {
        typeUrl: Authz.v1beta1.MsgRevokeTypeUrl,
        value: MsgRevoke.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
          msgTypeUrl: value.msg_type_url,
        }),
      } as Authz.v1beta1.MsgRevokeEncodeObject;
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
    case Feegrant.v1beta1.BasicAllowanceTypeUrl:
      return Any.fromPartial({
        typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
        value: BasicAllowance.encode(
          BasicAllowance.fromPartial({
            expiration: allowance.expiration
              ? timestampFromDate(new Date(allowance.expiration))
              : undefined,
            spendLimit: allowance.spend_limit,
          }),
        ).finish(),
      });

    case Feegrant.v1beta1.PeriodicAllowanceTypeUrl:
      return Any.fromPartial({
        typeUrl: Feegrant.v1beta1.PeriodicAllowanceTypeUrl,
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

    case Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl:
      return Any.fromPartial({
        typeUrl: Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl,
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
    case Feegrant.v1beta1.MsgGrantAllowanceTypeUrl:
      return {
        typeUrl: Feegrant.v1beta1.MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
          allowance: decodeAllowance(value.allowance),
        }),
      } as Feegrant.v1beta1.MsgGrantAllowanceEncodeObject;

    case Feegrant.v1beta1.MsgRevokeAllowanceTypeUrl:
      return {
        typeUrl: Feegrant.v1beta1.MsgRevokeAllowanceTypeUrl,
        value: MsgRevokeAllowance.fromPartial({
          granter: value.granter,
          grantee: value.grantee,
        }),
      } as Feegrant.v1beta1.MsgRevokeAllowanceEncodeObject;
    default:
      return undefined;
  }
};

const decodeSubspaceMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case Subspaces.v3.MsgEditSubspaceTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgEditSubspaceTypeUrl,
        value: MsgEditSubspace.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          name: value.name,
          description: value.description,
          owner: value.owner,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgEditSubspaceEncodeObject;

    case Subspaces.v3.MsgDeleteSubspaceTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgDeleteSubspaceTypeUrl,
        value: MsgDeleteSubspace.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgDeleteSubspaceEncodeObject;

    case Subspaces.v3.MsgCreateSectionTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgCreateSectionTypeUrl,
        value: MsgCreateSection.fromPartial({
          name: value.name,
          description: value.description,
          parentId: value.parent_id,
          subspaceId: Long.fromString(value.subspace_id),
          creator: value.creator,
        }),
      } as Subspaces.v3.MsgCreateSectionEncodeObject;

    case Subspaces.v3.MsgEditSectionTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgEditSectionTypeUrl,
        value: MsgEditSection.fromPartial({
          name: value.name,
          description: value.description,
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          editor: value.editor,
        }),
      } as Subspaces.v3.MsgEditSectionEncodeObject;

    case Subspaces.v3.MsgMoveSectionTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgMoveSectionTypeUrl,
        value: MsgMoveSection.fromPartial({
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          newParentId: value.new_parent_id,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgMoveSectionEncodeObject;

    case Subspaces.v3.MsgDeleteSectionTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgDeleteSectionTypeUrl,
        value: MsgDeleteSection.fromPartial({
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgDeleteSectionEncodeObject;

    case Subspaces.v3.MsgCreateUserGroupTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgCreateUserGroupTypeUrl,
        value: MsgCreateUserGroup.fromPartial({
          name: value.name,
          description: value.description,
          creator: value.creator,
          initialMembers: value.initial_members,
          sectionId: value.section_id,
          subspaceId: Long.fromString(value.subspace_id),
          defaultPermissions: value.default_permissions,
        }),
      } as Subspaces.v3.MsgCreateUserGroupEncodeObject;

    case Subspaces.v3.MsgEditUserGroupTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgEditUserGroupTypeUrl,
        value: MsgEditUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          name: value.name,
          description: value.description,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgEditUserGroupEncodeObject;

    case Subspaces.v3.MsgMoveUserGroupTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgMoveUserGroupTypeUrl,
        value: MsgMoveUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          newSectionId: value.new_section_id,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgMoveUserGroupEncodeObject;

    case Subspaces.v3.MsgSetUserGroupPermissionsTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgSetUserGroupPermissionsTypeUrl,
        value: MsgSetUserGroupPermissions.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          permissions: value.permissions,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgSetUserGroupPermissionsEncodeObject;

    case Subspaces.v3.MsgDeleteUserGroupTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgDeleteUserGroupTypeUrl,
        value: MsgDeleteUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgDeleteUserGroupEncodeObject;

    case Subspaces.v3.MsgAddUserToUserGroupTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgAddUserToUserGroupTypeUrl,
        value: MsgAddUserToUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          user: value.user,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgAddUserToUserGroupEncodeObject;

    case Subspaces.v3.MsgRemoveUserFromUserGroupTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgRemoveUserFromUserGroupTypeUrl,
        value: MsgRemoveUserFromUserGroup.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          groupId: value.group_id,
          user: value.user,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgRemoveUserFromUserGroupEncodeObject;

    case Subspaces.v3.MsgSetUserPermissionsTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgSetUserPermissionsTypeUrl,
        value: MsgSetUserPermissions.fromPartial({
          subspaceId: Long.fromString(value.subspace_id),
          sectionId: value.section_id ?? 0,
          user: value.user,
          permissions: value.permissions,
          signer: value.signer,
        }),
      } as Subspaces.v3.MsgSetUserPermissionsEncodeObject;

    case Subspaces.v3.MsgCreateSubspaceTypeUrl:
      return {
        typeUrl: Subspaces.v3.MsgCreateSubspaceTypeUrl,
        value: {
          name: value.name,
          description: value.description,
          owner: value.owner,
          creator: value.creator,
        },
      } as Subspaces.v3.MsgCreateSubspaceEncodeObject;

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
    case Posts.v3.PollTypeUrl:
      return {
        typeUrl: Posts.v3.PollTypeUrl,
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
                      }) as Attachment,
                  ),
                }) as Poll_ProvidedAnswer,
            ),
          }),
        ).finish(),
      } as Any;

    case Posts.v3.MediaTypeUrl:
      return {
        typeUrl: Posts.v3.MediaTypeUrl,
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
        }) as Url,
    ),
  });
};

const decodePostsMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case Posts.v3.MsgCreatePostTypeUrl:
      return {
        typeUrl: Posts.v3.MsgCreatePostTypeUrl,
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
      } as Posts.v3.MsgCreatePostEncodeObject;

    case Posts.v3.MsgEditPostTypeUrl:
      return {
        typeUrl: Posts.v3.MsgEditPostTypeUrl,
        value: MsgEditPost.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          text: value.text,
          tags: value.tags,
          entities: decodeEntities(value.entities),
          editor: value.editor,
        }),
      } as Posts.v3.MsgEditPostEncodeObject;

    case Posts.v3.MsgDeletePostTypeUrl:
      return {
        typeUrl: Posts.v3.MsgDeletePostTypeUrl,
        value: MsgDeletePost.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          signer: value.signer,
        }),
      } as Posts.v3.MsgDeletePostEncodeObject;

    case Posts.v3.MsgAddPostAttachmentTypeUrl:
      return {
        typeUrl: Posts.v3.MsgAddPostAttachmentTypeUrl,
        value: MsgAddPostAttachment.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          content: decodeAttachmentContent(value.content),
          editor: value.editor,
        }),
      } as Posts.v3.MsgAddPostAttachmentEncodeObject;

    case Posts.v3.MsgRemovePostAttachmentTypeUrl:
      return {
        typeUrl: Posts.v3.MsgRemovePostAttachmentTypeUrl,
        value: MsgRemovePostAttachment.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          attachmentId: value.attachment_id,
          editor: value.editor,
        }),
      } as Posts.v3.MsgRemovePostAttachmentEncodeObject;

    case Posts.v3.MsgAnswerPollTypeUrl:
      return {
        typeUrl: Posts.v3.MsgAnswerPollTypeUrl,
        value: MsgAnswerPoll.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          pollId: value.poll_id,
          answersIndexes: value.answers_indexes,
          signer: value.signer,
        }),
      } as Posts.v3.MsgAnswerPollEncodeObject;

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
    case Reactions.v1.RegisteredReactionValueTypeUrl:
      return Any.fromPartial({
        typeUrl: Reactions.v1.RegisteredReactionValueTypeUrl,
        value: RegisteredReactionValue.encode(
          RegisteredReactionValue.fromPartial({
            registeredReactionId: value.registered_reaction_id,
          }),
        ).finish(),
      });

    case Reactions.v1.FreeTextValueTypeUrl:
      return Any.fromPartial({
        typeUrl: Reactions.v1.FreeTextValueTypeUrl,
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
    case Reactions.v1.MsgAddReactionTypeUrl:
      return {
        typeUrl: Reactions.v1.MsgAddReactionTypeUrl,
        value: MsgAddReaction.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          value: decodeReactionValue(value.value),
          user: value.user,
        }),
      } as Reactions.v1.MsgAddReactionEncodeObject;

    case Reactions.v1.MsgRemoveReactionTypeUrl:
      return {
        typeUrl: Reactions.v1.MsgRemoveReactionTypeUrl,
        value: MsgRemoveReaction.fromPartial({
          subspaceId: value.subspace_id,
          postId: value.post_id,
          reactionId: value.reaction_id,
          user: value.user,
        }),
      } as Reactions.v1.MsgRemoveReactionEncodeObject;

    case Reactions.v1.MsgAddRegisteredReactionTypeUrl:
      return {
        typeUrl: Reactions.v1.MsgAddRegisteredReactionTypeUrl,
        value: MsgAddRegisteredReaction.fromPartial({
          subspaceId: value.subspace_id,
          displayValue: value.display_value,
          shorthandCode: value.shorthand_code,
          user: value.user,
        }),
      } as Reactions.v1.MsgAddRegisteredReactionEncodeObject;

    case Reactions.v1.MsgEditRegisteredReactionTypeUrl:
      return {
        typeUrl: Reactions.v1.MsgEditRegisteredReactionTypeUrl,
        value: MsgEditRegisteredReaction.fromPartial({
          subspaceId: value.subspace_id,
          registeredReactionId: value.registered_reaction_id,
          shorthandCode: value.shorthand_code,
          displayValue: value.display_value,
          user: value.user,
        }),
      } as Reactions.v1.MsgEditRegisteredReactionEncodeObject;

    case Reactions.v1.MsgRemoveRegisteredReactionTypeUrl:
      return {
        typeUrl: Reactions.v1.MsgRemoveRegisteredReactionTypeUrl,
        value: MsgRemoveRegisteredReaction.fromPartial({
          subspaceId: value.subspace_id,
          registeredReactionId: value.registered_reaction_id,
          user: value.user,
        }),
      } as Reactions.v1.MsgRemoveRegisteredReactionEncodeObject;

    case Reactions.v1.MsgSetReactionsParamsTypeUrl:
      return {
        typeUrl: Reactions.v1.MsgSetReactionsParamsTypeUrl,
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
      } as Reactions.v1.MsgSetReactionsParamsEncodeObject;

    default:
      return undefined;
  }
};

const decodeRelationshipMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case Relationships.v1.MsgBlockUserTypeUrl:
      return {
        typeUrl: Relationships.v1.MsgBlockUserTypeUrl,
        value: {
          subspaceId: Long.fromString(value.subspace_id),
          blocked: value.blocked,
          blocker: value.blocker,
          reason: value.reason,
        },
      } as Relationships.v1.MsgBlockUserEncodeObject;

    case Relationships.v1.MsgCreateRelationshipTypeUrl:
      return {
        typeUrl: Relationships.v1.MsgCreateRelationshipTypeUrl,
        value: {
          signer: value.signer,
          subspaceId: Long.fromString(value.subspace_id),
          counterparty: value.counterparty,
        },
      } as Relationships.v1.MsgCreateRelationshipEncodeObject;

    case Relationships.v1.MsgDeleteRelationshipTypeUrl:
      return {
        typeUrl: Relationships.v1.MsgDeleteRelationshipTypeUrl,
        value: {
          signer: value.signer,
          subspaceId: Long.fromString(value.subspace_id),
          counterparty: value.counterparty,
        },
      } as Relationships.v1.MsgDeleteRelationshipEncodeObject;

    case Relationships.v1.MsgUnblockUserTypeUrl:
      return {
        typeUrl: Relationships.v1.MsgUnblockUserTypeUrl,
        value: {
          subspaceId: Long.fromString(value.subspace_id),
          blocked: value.blocked,
          blocker: value.blocker,
        },
      } as Relationships.v1.MsgUnblockUserEncodeObject;

    default:
      return undefined;
  }
};

const decodeReportTarget = (target: any): Any | undefined => {
  const type = target['@type'];

  switch (type) {
    case Reports.v1.PostTargetTypeUrl:
      return Any.fromPartial({
        typeUrl: Reports.v1.PostTargetTypeUrl,
        value: PostTarget.encode(
          PostTarget.fromPartial({
            postId: target.post_id,
          }),
        ).finish(),
      });

    case Reports.v1.UserTargetTypeUrl:
      return Any.fromPartial({
        typeUrl: Reports.v1.UserTargetTypeUrl,
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
    case Reports.v1.MsgCreateReportTypeUrl:
      return {
        typeUrl: Reports.v1.MsgCreateReportTypeUrl,
        value: MsgCreateReport.fromPartial({
          subspaceId: value.subspace_id,
          message: value.message,
          reporter: value.reporter,
          reasonsIds: value.reasons_ids,
          target: decodeReportTarget(value.target),
        }),
      } as Reports.v1.MsgCreateReportEncodeObject;

    case Reports.v1.MsgDeleteReportTypeUrl:
      return {
        typeUrl: Reports.v1.MsgDeleteReportTypeUrl,
        value: MsgDeleteReport.fromPartial({
          subspaceId: value.subspace_id,
          reportId: value.report_id,
          signer: value.signer,
        }),
      } as Reports.v1.MsgDeleteReportEncodeObject;

    case Reports.v1.MsgSupportStandardReasonTypeUrl:
      return {
        typeUrl: Reports.v1.MsgSupportStandardReasonTypeUrl,
        value: MsgSupportStandardReason.fromPartial({
          subspaceId: value.subspace_id,
          standardReasonId: value.standard_reason_id,
          signer: value.signer,
        }),
      } as Reports.v1.MsgSupportStandardReasonEncodeObject;

    case Reports.v1.MsgAddReasonTypeUrl:
      return {
        typeUrl: Reports.v1.MsgAddReasonTypeUrl,
        value: MsgAddReason.fromPartial({
          subspaceId: value.subspace_id,
          description: value.description,
          title: value.title,
          signer: value.signer,
        }),
      } as Reports.v1.MsgAddReasonEncodeObject;

    case Reports.v1.MsgRemoveReasonTypeUrl:
      return {
        typeUrl: Reports.v1.MsgRemoveReasonTypeUrl,
        value: MsgRemoveReason.fromPartial({
          subspaceId: value.subspace_id,
          reasonId: value.reason_id,
          signer: value.signer,
        }),
      } as Reports.v1.MsgRemoveReasonEncodeObject;

    default:
      return undefined;
  }
};

const decodeUpgradeMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case SoftwareUpgradeProposalTypeUrl:
      return {
        typeUrl: SoftwareUpgradeProposalTypeUrl,
        value: {
          title: value.title,
          description: value.description,
          plan:
            value?.plan !== undefined
              ? {
                  name: value.plan?.name,
                  time: value.plan.time,
                  height: Long.fromString(value.plan.height),
                  info: value.plan.info,
                }
              : undefined,
        },
      } as SoftwareUpgradeProposalEncodeObject;

    case MsgSoftwareUpgradeTypeUrl:
      return {
        typeUrl: MsgSoftwareUpgradeTypeUrl,
        value: MsgSoftwareUpgrade.fromPartial({
          authority: value.authority,
          plan: value?.plan
            ? {
                name: value.plan.name,
                info: value.plan.info,
                height: value.plan.height,
                time: value.plan.time,
              }
            : undefined,
        }),
      } as MsgSoftwareUpgradeEncodeObject;

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
  decodeRelationshipMessage,
  decodeReportsMessage,
  decodeStakingMessage,
  decodeSubspaceMessage,
  decodeUpgradeMessage,
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
