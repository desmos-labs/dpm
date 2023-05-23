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
   * Coin denomination.
   */
  readonly denom: string;
  /**
   * Coin amount.
   */
  readonly amount: string;
  /**
   * Coin fiat value.
   */
  readonly fiatValue: number;
}
