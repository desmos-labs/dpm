import { coin } from '@cosmjs/amino';
import { safePartFloat } from 'lib/FormatUtils';
import { Delegation, PendingReward, Redelegation } from 'types/distribution';

/**
 * Format an incoming delegation data from the server into a format that is easier to parse by the app.
 * @param delegation - Delegation data retrieved from the server.
 * @return {Delegation} - A formatted Delegation object.
 */
export function convertGraphQLDelegation(delegation: any): Delegation {
  return {
    validatorAddress: delegation.validator_address,
    coins: delegation.coins.map((c: any) => coin(c.amount, c.denom)),
  };
}

/**
 * Format an incoming pending reward data from the server into a format that is easier to parse by the app.
 * @param reward - Pending reward data retrieved from the server.
 * @return {PendingReward} - A formatted PendingReward object.
 */
export function convertGraphQLPendingReward(reward: any): PendingReward {
  return {
    validatorAddress: reward.validator_address,
    coins: reward.coins.map((c: any) => coin(Math.trunc(safePartFloat(c.amount)), c.denom)),
  };
}

/**
 * Format an incoming redelegation data from the server into a format that is easier to parse by the app.
 * @param redelegation - Redelegation data retrieved from the server.
 * @return {Redelegation} - A formatted Redelegation object.
 */
export function convertGraphQLRedelegation(redelegation: any): Redelegation[] {
  return redelegation.entries.map(
    (e: any) =>
      ({
        delegatorAddress: redelegation.delegator_address,
        validatorDstAddress: redelegation.validator_dst_address,
        validatorSrcAddress: redelegation.validator_src_address,
        balance: e.balance,
        completionTime: new Date(e.completion_time),
      } as Redelegation),
  );
}
