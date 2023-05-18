/**
 * Enum that defines what amount will be used as limit upper limit.
 */
export enum AmountLimit {
  /**
   * Use the current active account balance as limit.
   */
  UserBalance,
  /**
   * Use the amount of tokens delegated to a validator as limit.
   * Note: when using this value you must provide the validator
   * operator address.
   */
  DelegatedToValidator,
}

/**
 * Interface that represents a limit that will use the
 * current active account balance.
 */
export interface UserAmountLimitConfig {
  readonly mode: AmountLimit.UserBalance;
}

/**
 * Interface that represents a limit that will use the
 * amount of tokens staked torward a validator from the current
 * active user.
 */
export interface DelegatedToValidatorLimitConfig {
  readonly mode: AmountLimit.DelegatedToValidator;
  readonly validatorAddress: string;
}

export type AmountLimitConfig = DelegatedToValidatorLimitConfig | UserAmountLimitConfig;
