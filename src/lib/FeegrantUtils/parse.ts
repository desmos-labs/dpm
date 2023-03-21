import { Any } from 'cosmjs-types/google/protobuf/any';
import { err, ok, Result } from 'neverthrow';
import {
  AllowedMsgAllowance,
  BasicAllowance,
  PeriodicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  PeriodicAllowanceTypeUrl,
} from '@desmoslabs/desmjs';

export interface BasicAllowanceEncodeObject {
  readonly typeUrl: typeof BasicAllowanceTypeUrl;
  readonly allowance: BasicAllowance;
}

export interface PeriodicAllowanceEncodeObject {
  readonly typeUrl: typeof PeriodicAllowanceTypeUrl;
  readonly allowance: PeriodicAllowance;
}

export interface AllowedMsgAllowanceEncodeObject {
  readonly typeUrl: typeof AllowedMsgAllowanceTypeUrl;
  readonly allowance: AllowedMsgAllowance;
}

export type AllowanceEncodeObject =
  | BasicAllowanceEncodeObject
  | PeriodicAllowanceEncodeObject
  | AllowedMsgAllowanceEncodeObject;

/**
 * Parses an encoded allowance object.
 * @param allowance - The allowance to decode.
 */
export function parseAllowance(allowance?: Any): Result<AllowanceEncodeObject | undefined, Error> {
  if (!allowance) {
    return ok(undefined);
  }

  switch (allowance.typeUrl) {
    case BasicAllowanceTypeUrl:
      return ok({
        typeUrl: BasicAllowanceTypeUrl,
        allowance: BasicAllowance.decode(allowance.value),
      });
    case PeriodicAllowanceTypeUrl:
      return ok({
        typeUrl: PeriodicAllowanceTypeUrl,
        allowance: PeriodicAllowance.decode(allowance.value),
      });
    case AllowedMsgAllowanceTypeUrl:
      return ok({
        typeUrl: AllowedMsgAllowanceTypeUrl,
        allowance: AllowedMsgAllowance.decode(allowance.value),
      });
    default:
      return err(new Error(`Unsupported allowance type: ${allowance.typeUrl}`));
  }
}
