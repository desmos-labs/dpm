import { coin } from '@cosmjs/amino';
import { Delegation } from 'types/distribution';

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
