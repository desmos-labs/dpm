import { Message } from 'types/transactions';
import { Bank, Coin, Distribution, Gov, Staking, TokenFactory } from '@desmoslabs/desmjs';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { sumCoins } from 'lib/CoinsUtils';
import { MsgFundCommunityPool } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDeposit as MsgDepositV1Beta1 } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { MsgTransferTypeUrl } from 'types/cosmos';
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgDeposit as MsgDepositV1 } from '@desmoslabs/desmjs-types/cosmos/gov/v1/tx';
import { MsgBurn, MsgMint } from '@desmoslabs/desmjs-types/desmos/tokenfactory/v1/msgs';

/**
 * Converts a {@link Coin} into a list of {@link Coin}.
 * If the provided coin is undefined this function will return an empty list.
 * @param c - The {@link Coin} object to convert.
 */
const coinToCoins = (c?: Coin): Coin[] => (c ? [c] : []);

/**
 * Hook that provides a function to extract the
 * amount of coins present inside a {@link Message}.
 * @param message - The message from which the total amount will be extracted.
 */
export const getMessageAmount = (message: Message) => {
  switch (message.typeUrl) {
    // Bank module:
    case Bank.v1beta1.MsgSendTypeUrl:
      return (message.value as MsgSend).amount;
    case Bank.v1beta1.MsgMultiSendTypeUrl:
      return sumCoins((message.value as MsgMultiSend).outputs.flatMap((o) => o.coins));

    // Distribution module
    case Distribution.v1beta1.MsgFundCommunityPoolTypeUrl:
      return (message.value as MsgFundCommunityPool).amount;

    // Gov module
    case Gov.v1beta1.MsgDepositTypeUrl:
      return (message.value as MsgDepositV1Beta1).amount;
    case Gov.v1.MsgDepositTypeUrl:
      return (message.value as MsgDepositV1).amount;

    // IBC Module
    case MsgTransferTypeUrl:
      return coinToCoins((message.value as MsgTransfer).token);

    // Staking module
    case Staking.v1beta1.MsgDelegateTypeUrl:
      return coinToCoins((message.value as MsgDelegate).amount);
    case Staking.v1beta1.MsgUndelegateTypeUrl:
      return coinToCoins((message.value as MsgUndelegate).amount);
    case Staking.v1beta1.MsgBeginRedelegateTypeUrl:
      return coinToCoins((message.value as MsgBeginRedelegate).amount);

    // Tokenfactory module
    case TokenFactory.v1.MsgMintTypeUrl:
      return coinToCoins((message.value as MsgMint).amount);
    case TokenFactory.v1.MsgBurnTypeUrl:
      return coinToCoins((message.value as MsgBurn).amount);

    default:
      return undefined;
  }
};
