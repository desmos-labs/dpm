import { EncodeObject } from '@cosmjs/proto-signing';
import { MsgMultiSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';

export interface MsgMultiSendEncodeObject extends EncodeObject {
  readonly typeUrl: '/cosmos.bank.v1beta1.MsgMultiSend';
  readonly value: MsgMultiSend;
}
