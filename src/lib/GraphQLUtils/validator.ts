import { Validator, ValidatorStatus } from 'types/validator';
import { DesmosProfile } from 'types/desmos';

/**
 * Format an incoming validator status from the server into a format that is easier to parse by the app.
 * @param status - Validator status.
 * @return {ValidatorStatus} - A formatted ValidatorStatus.
 */
export function converGraphQLValidatorStatus(status: any): ValidatorStatus {
  if (status === undefined) {
    return ValidatorStatus.Unspecified;
  }

  switch (status) {
    case 0:
      return ValidatorStatus.Unspecified;
    case 1:
      return ValidatorStatus.Unbonded;
    case 2:
      return ValidatorStatus.Unbonding;
    case 3:
      return ValidatorStatus.Bonded;
    default:
      return ValidatorStatus.Unspecified;
  }
}

/**
 * Format an incoming validator data from the server into a format that is easier to parse by the app.
 * @param validator - Validator data retrieved from the server.
 * @param profile - Optional validator profile.
 * @return {Validator} - A formatted Validator object.
 */
export function convertGraphQLValidator(validator: any, profile?: DesmosProfile): Validator {
  return {
    operatorAddress: validator.validator_info.operator_address,
    selfDelegateAddress: validator.validator_info.self_delegate_address,
    status: converGraphQLValidatorStatus(validator.validator_statuses[0].status),
    commission: validator.validator_commissions[0]?.commission ?? 1,
    moniker: validator.validator_descriptions[0]?.moniker ?? 'N/A',
    votingPower: validator.validator_voting_powers[0]?.voting_power ?? 0,
    website: validator.validator_descriptions[0]?.website ?? undefined,
    avatarUrl: validator.validator_descriptions[0]?.avatar_url ?? undefined,
    details: validator.validator_descriptions[0]?.details ?? undefined,
    profile,
    tombStoned: validator.validator_statuses[0].tombstoned,
    jailed: validator.validator_statuses[0].jailed,
  };
}
