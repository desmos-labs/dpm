import { EncodeObject } from '@cosmjs/proto-signing';
import { QueriedMessage } from 'lib/TransactionUtils/types';
import {
  MsgDelegateEncodeObject,
  MsgSendEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@cosmjs/stargate';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import Long from 'long';
import {
  MsgAddUserToUserGroupEncodeObject,
  MsgAddUserToUserGroupTypeUrl,
  MsgCreateSectionEncodeObject,
  MsgCreateSectionTypeUrl,
  MsgCreateUserGroupEncodeObject,
  MsgCreateUserGroupTypeUrl,
  MsgDeleteSectionEncodeObject,
  MsgDeleteSectionTypeUrl,
  MsgDeleteSubspaceEncodeObject,
  MsgDeleteSubspaceTypeUrl,
  MsgDeleteUserGroupEncodeObject,
  MsgDeleteUserGroupTypeUrl,
  MsgEditSectionEncodeObject,
  MsgEditSectionTypeUrl,
  MsgEditSubspaceEncodeObject,
  MsgEditSubspaceTypeUrl,
  MsgEditUserGroupEncodeObject,
  MsgEditUserGroupTypeUrl,
  GenericAuthorizationTypeUrl,
  GenericSubspaceAuthorizationTypeUrl,
  MsgGrantEncodeObject,
  MsgGrantTypeUrl,
  MsgLinkChainAccountEncodeObject,
  MsgLinkChainAccountTypeUrl,
  MsgMoveSectionEncodeObject,
  MsgMoveSectionTypeUrl,
  MsgMoveUserGroupEncodeObject,
  MsgMoveUserGroupTypeUrl,
  MsgRemoveUserFromUserGroupEncodeObject,
  MsgRemoveUserFromUserGroupTypeUrl,
  MsgSaveProfileEncodeObject,
  MsgSaveProfileTypeUrl,
  MsgSetUserGroupPermissionsEncodeObject,
  MsgSetUserGroupPermissionsTypeUrl,
  MsgSetUserPermissionsEncodeObject,
  MsgSetUserPermissionsTypeUrl,
  MsgUnlinkChainAccountEncodeObject,
  MsgUnlinkChainAccountTypeUrl,
  SendAuthorizationTypeUrl,
  timestampFromDate,
} from '@desmoslabs/desmjs';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { Message } from 'types/transactions';
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
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { GenericSubspaceAuthorization } from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import { SendAuthorization } from 'cosmjs-types/cosmos/bank/v1beta1/authz';
import {
  authorizationTypeFromJSON,
  StakeAuthorization,
} from 'cosmjs-types/cosmos/staking/v1beta1/authz';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { StakeAuthorizationTypeUrl } from 'types/cosmos-staking';

const decodePubKey = (gqlPubKey: any): Any | undefined => {
  const type = gqlPubKey['@type'];
  const { key } = gqlPubKey;

  if (type === '/cosmos.crypto.secp256k1.PubKey') {
    return Any.fromPartial({
      typeUrl: type,
      value: PubKey.encode(
        PubKey.fromPartial({
          key: Buffer.from(key, 'utf-8'),
        }),
      ).finish(),
    });
  }
  return {} as never;
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
    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return {
        typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
        value: {
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgWithdrawDelegatorRewardEncodeObject;

    default:
      return undefined;
  }
};

const decodeGovMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case '/cosmos.gov.v1beta1.MsgVote': {
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
        typeUrl: '/cosmos.gov.v1beta1.MsgVote',
        value: {
          voter: value.voter,
          option: voteOption,
          proposalId: Long.fromString(value.proposal_id),
        },
      } as MsgVoteEncodeObject;
    }

    default:
      return undefined;
  }
};

const decodeStakingMessage = (type: string, value: any): EncodeObject | undefined => {
  switch (type) {
    case '/cosmos.staking.v1beta1.MsgDelegate':
      return {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: {
          amount: value.amount,
          delegatorAddress: value.delegator_address,
          validatorAddress: value.validator_address,
        },
      } as MsgDelegateEncodeObject;

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

    default:
      return undefined;
  }
};

const decodeGrant = (grant: any): Grant | undefined => {
  if (grant === undefined) {
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
          owner: value.owner,
          signer: value.signer,
          description: value.description,
          treasury: value.treasury,
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

    default:
      return undefined;
  }
};

const converters = [
  decodeBankMessage,
  decodeDistributionMessage,
  decodeGovMessage,
  decodeStakingMessage,
  decodeProfileMessage,
  decodeAuthzMessage,
  decodeSubspaceMessage,
];

const decodeQueriedMessage = (message: QueriedMessage): Message => {
  const type = message.type.startsWith('/') ? message.type : `/${message.type}`;
  const { value } = message;

  let converted: EncodeObject | undefined;
  for (let i = 0; i < converters.length; i += 1) {
    converted = converters[i](type, value);
    if (converted) break;
  }

  if (converted) {
    return {
      index: message.index,
      ...converted,
    };
  }

  // console.warn('Unsupported message type while parsing tx from GraphQL', type, message);
  return {
    index: message.index,
    typeUrl: type,
    value,
  };
};

export default decodeQueriedMessage;
