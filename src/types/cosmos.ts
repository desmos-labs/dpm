// TODO: Replace this with the one exposed from @desmoslabs/desmjs when fixed.
import { EncodeObject } from '@cosmjs/proto-signing';
import { MsgExec } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { Distribution } from '@desmoslabs/desmjs';
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { SoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { MsgSoftwareUpgrade } from '@desmoslabs/desmjs-types/cosmos/upgrade/v1beta1/tx';

export const StakeAuthorizationTypeUrl = '/cosmos.staking.v1beta1.StakeAuthorization';
export const MsgTransferTypeUrl = '/ibc.applications.transfer.v1.MsgTransfer';
export const MsgExecTypeUrl = '/cosmos.authz.v1beta1.MsgExec';
export const MsgUpdateStakingModuleParamsTypeUrl = '/cosmos.staking.v1beta1.MsgUpdateParams';
export const SoftwareUpgradeProposalTypeUrl = '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal';
export const MsgSoftwareUpgradeTypeUrl = '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade';

export interface MsgUpdateStakingModuleParams {
  readonly params: {
    bondDenom: string;
    maxEntries: number;
    maxValidators: number;
    unbondingTime: string;
    historicalEntries: number;
    minCommissionRate: string;
  };
  readonly authority: string;
}

export interface MsgExecEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgExecTypeUrl;
  readonly value: MsgExec;
}

export interface MsgSetWithdrawAddressEncodeObject extends EncodeObject {
  readonly typeUrl: typeof Distribution.v1beta1.MsgSetWithdrawAddressTypeUrl;
  readonly value: MsgSetWithdrawAddress;
}

export interface MsgWithdrawValidatorCommissionEncodeObject extends EncodeObject {
  readonly typeUrl: typeof Distribution.v1beta1.MsgWithdrawValidatorCommissionTypeUrl;
  readonly value: MsgWithdrawValidatorCommission;
}

export interface MsgFundCommunityPoolEncodeObject extends EncodeObject {
  readonly typeUrl: typeof Distribution.v1beta1.MsgFundCommunityPoolTypeUrl;
  readonly value: MsgFundCommunityPool;
}

export interface MsgUpdateStakingModuleParamsEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgUpdateStakingModuleParamsTypeUrl;
  readonly value: MsgUpdateStakingModuleParams;
}

export interface SoftwareUpgradeProposalEncodeObject extends EncodeObject {
  readonly typeUrl: typeof SoftwareUpgradeProposalTypeUrl;
  readonly value: SoftwareUpgradeProposal;
}

export interface MsgSoftwareUpgradeEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgSoftwareUpgradeTypeUrl;
  readonly value: MsgSoftwareUpgrade;
}
