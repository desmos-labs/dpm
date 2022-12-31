import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { calculateFee } from '@cosmjs/stargate';
import MsgTypes from './msgtypes';

/**
 * Interface that represents the various level
 * of the gas prices.
 */
export interface GasPrices {
  readonly low: string;
  readonly average: string;
  readonly high: string;
}

/**
 * Default desmos gas prices.
 * The price are without denom since it depends on the chain selected from the user.
 */
export const DefaultGasPrice: GasPrices = {
  low: '0.005',
  average: '0.01',
  high: '0.03',
};

/**
 * Tx price levels.
 */
export type TxPriceLevel = keyof TxFees;

/**
 * Interface that represents the various level
 * of fees that can be paid for a transaction.
 */
export interface TxFees {
  readonly low: StdFee;
  readonly average: StdFee;
  readonly high: StdFee;
}

/**
 * Computes the tx fees for
 * @param gas - The tx gas.
 * @param denom - The chain coin denom.
 * @param prices - Optional gas price levels.
 */
export function computeTxFees(gas: number, denom: string, prices?: GasPrices): TxFees {
  const gasPrices = prices ?? DefaultGasPrice;
  return {
    low: calculateFee(gas, `${gasPrices.low}${denom}`),
    average: calculateFee(gas, `${gasPrices.average}${denom}`),
    high: calculateFee(gas, `${gasPrices.high}${denom}`),
  };
}

/**
 * Estimates the total gas needed to process the provided messages.
 * @param msg - List of messages.
 */
export function messagesGas(msg: EncodeObject[]): number {
  let gas = 0;

  msg.forEach((m) => {
    switch (m.typeUrl) {
      case MsgTypes.MsgLinkChainAccount:
      case MsgTypes.MsgUnlinkChainAccount:
      case MsgTypes.MsgSaveProfile:
        gas += 200000;
        break;

      case MsgTypes.MsgSend:
        gas += 140000;
        break;

      default:
        gas += 140000;
        break;
    }
  });

  return gas;
}
