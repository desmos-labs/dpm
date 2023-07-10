// TODO: Replace this with the one exposed from @desmoslabs/desmjs when fixed.
import { EncodeObject } from '@cosmjs/proto-signing';
import { MsgExec } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {
  MsgFundCommunityPoolTypeUrl,
  MsgSetWithdrawAddressTypeUrl,
  MsgWithdrawValidatorCommissionTypeUrl,
} from '@desmoslabs/desmjs';
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

export const StakeAuthorizationTypeUrl = '/cosmos.staking.v1beta1.StakeAuthorization';
export const MsgTransferTypeUrl = '/ibc.applications.transfer.v1.MsgTransfer';
export const MsgExecTypeUrl = '/cosmos.authz.v1beta1.MsgExec';
export const MsgUpdateStakingModuleParamsTypeUrl = '/cosmos.staking.v1beta1.MsgUpdateParams';

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
  readonly typeUrl: typeof MsgSetWithdrawAddressTypeUrl;
  readonly value: MsgSetWithdrawAddress;
}

export interface MsgWithdrawValidatorCommissionEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgWithdrawValidatorCommissionTypeUrl;
  readonly value: MsgWithdrawValidatorCommission;
}

export interface MsgFundCommunityPoolEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgFundCommunityPoolTypeUrl;
  readonly value: MsgFundCommunityPool;
}

export interface MsgUpdateStakingModuleParamsEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgUpdateStakingModuleParamsTypeUrl;
  readonly value: MsgUpdateStakingModuleParams;
}
