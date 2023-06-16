// TODO: Replace this with the one exposed from @desmoslabs/desmjs when fixed.
import { EncodeObject } from '@cosmjs/proto-signing';
import { MsgExec } from 'cosmjs-types/cosmos/authz/v1beta1/tx';

export const StakeAuthorizationTypeUrl = '/cosmos.staking.v1beta1.StakeAuthorization';
export const MsgTransferTypeUrl = '/ibc.applications.transfer.v1.MsgTransfer';
export const MsgExecTypeUrl = '/cosmos.authz.v1beta1.MsgExec';

export interface MsgExecEncodeObject extends EncodeObject {
  readonly typeUrl: typeof MsgExecTypeUrl;
  readonly value: MsgExec;
}
