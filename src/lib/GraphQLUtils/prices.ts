import { TokenPrice } from 'types/prices';

/**
 * Convert the GraphQL response into a list of token prices.
 * @param data {any} - The GraphQL response.
 */
export const convertGraphQLTokenPrice = (data: any): TokenPrice[] =>
  (data?.tokens ?? [])
    .flatMap((token: any) => token.units)
    .map(
      (unit: any) =>
        ({
          price: unit.price?.price ?? 0,
          exponent: unit.exponent ?? 0,
          denom: unit.denom,
        }) as TokenPrice,
    );
