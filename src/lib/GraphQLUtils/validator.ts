import { GQLValidator } from 'services/graphql/queries/GetValidators';
import { Validator } from 'types/validator';

/**
 * Format an incoming validator data from the server into a format that is easier to parse by the app.
 * @param validator - Validator data retrieved from the server.
 * @return {Validator} - A formatted Validator object.
 */
export function convertGraphQLValidator(validator: GQLValidator): Validator {
  return {
    address: validator.validator_descriptions[0].validator_address,
    commission: validator.validator_commissions[0].commission,
    moniker: validator.validator_descriptions[0].moniker,
    votingPower: validator.validator_voting_powers[0].voting_power,
    website: validator.validator_descriptions[0].website ?? undefined,
    avatarUrl: validator.validator_descriptions[0].avatar_url ?? undefined,
  };
}
