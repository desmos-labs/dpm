/**
 * Interface that represents a validator.
 */
export interface Validator {
  /**
   * Validator address.
   */
  readonly address: string;
  /**
   * Validator moniker.
   */
  readonly moniker: string;
  /**
   * Validator avatar url.
   */
  readonly avatarUrl?: string;
  /**
   * Validator short description.
   */
  readonly details?: string;
  /**
   * Validator website url.
   */
  readonly website?: string;
  /**
   * Validator voting power.
   */
  readonly votingPower: number;
  /**
   * Validator commission percentage represented
   * with a number inside this range [0, 1].
   */
  readonly commission: number;
}
