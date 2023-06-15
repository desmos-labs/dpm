import { Message } from 'types/transactions';
import {
  Coin,
  MsgBeginRedelegateTypeUrl,
  MsgDelegateTypeUrl,
  MsgDepositTypeUrl,
  MsgFundCommunityPoolTypeUrl,
  MsgMultiSendTypeUrl,
  MsgSendTypeUrl,
  MsgUndelegateTypeUrl,
} from '@desmoslabs/desmjs';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { sumCoins } from 'lib/CoinsUtils';
import { MsgFundCommunityPool } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDeposit } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { MsgTransferTypeUrl } from 'types/cosmos';
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx';

const coinToCoins = (c?: Coin): Coin[] => (c ? [c] : []);

/**
 * Hook that provides a function to extract the
 * amount of coins present inside a message.
 */
export const getMessageAmount = (message: Message) => {
  switch (message.typeUrl) {
    // Bank module:
    case MsgSendTypeUrl:
      return (message.value as MsgSend).amount;
    case MsgMultiSendTypeUrl:
      return sumCoins((message.value as MsgMultiSend).outputs.flatMap((o) => o.coins));

    // Distribution module
    case MsgFundCommunityPoolTypeUrl:
      return (message.value as MsgFundCommunityPool).amount;

    // Gov module
    case MsgDepositTypeUrl:
      return (message.value as MsgDeposit).amount;

    // IBC Module
    case MsgTransferTypeUrl:
      return coinToCoins((message.value as MsgTransfer).token);

    // Staking module
    case MsgDelegateTypeUrl:
      return coinToCoins((message.value as MsgDelegate).amount);
    case MsgUndelegateTypeUrl:
      return coinToCoins((message.value as MsgUndelegate).amount);
    case MsgBeginRedelegateTypeUrl:
      return coinToCoins((message.value as MsgBeginRedelegate).amount);

    default:
      return undefined;
  }
};
