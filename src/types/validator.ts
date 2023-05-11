import { DesmosProfile } from 'types/desmos';

export enum ValidatorStatus {
  Unspecified = 0,
  Unbonded = 1,
  Unbonding = 2,
  Bonded = 3,
}

/**
 * Interface that represents a validator.
 */
export interface Validator {
  /**
   * Validator address.
   */
  readonly operatorAddress: string;
  /**
   * Validator self delegate address.
   */
  readonly selfDelegateAddress: string;
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
  /**
   * Desmos profile associated to the validator selfDelegateAddress.
   */
  readonly profile?: DesmosProfile;
  /**
   * Validator status.
   */
  readonly status: ValidatorStatus;
  /**
   * Tells if the validator has been jailed.
   */
  readonly jailed: boolean;
  /**
   * Tells if the validator is tomb stoned.
   */
  readonly tombStoned: boolean;
}
