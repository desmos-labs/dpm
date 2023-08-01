import { Coin } from '@desmoslabs/desmjs';

/**
 * Contains the information of a given token price.
 */
export interface TokenPrice {
  /**
   * Denomination of the token.
   */
  readonly denom: string;
  /**
   * Exponent of the denomination.
   */
  readonly exponent: number;
  /**
   * Price of the token.
   */
  readonly price: number;
}

/**
 * Interface that represents a Coin with its fiat value.
 */
export interface CoinFiatValue {
  /**
   * The {@link Coin} for which the fiat value has been computed.
   */
  readonly coin: Coin;
  /**
   * Coin fiat value.
   */
  readonly fiatValue: number;
  /**
   * Factor used to convert the coin amount to its fiat value.
   */
  readonly coinConversionFactory: number;
  /**
   * The fiat currency name like USD or EUR.
   */
  readonly currency: string;
  /**
   * The fiat currency symbol like $ or €.
   */
  readonly currencySymbol: string;
}

export const zeroCoinFiatValue = (coin: Coin): CoinFiatValue => ({
  coin,
  coinConversionFactory: 0,
  fiatValue: 0,
  currency: 'USD',
  currencySymbol: '$',
});
