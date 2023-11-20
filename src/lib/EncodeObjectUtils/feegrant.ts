import { Any } from 'cosmjs-types/google/protobuf/any';
import { err, ok, Result } from 'neverthrow';
import {
  AllowedMsgAllowance,
  BasicAllowance,
  PeriodicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import { Feegrant } from '@desmoslabs/desmjs';

interface BasicAllowanceEncodeObject {
  readonly typeUrl: typeof Feegrant.v1beta1.BasicAllowanceTypeUrl;
  readonly allowance: BasicAllowance;
}

interface PeriodicAllowanceEncodeObject {
  readonly typeUrl: typeof Feegrant.v1beta1.PeriodicAllowanceTypeUrl;
  readonly allowance: PeriodicAllowance;
}

interface AllowedMsgAllowanceEncodeObject {
  readonly typeUrl: typeof Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl;
  readonly allowance: AllowedMsgAllowance;
}

type AllowanceEncodeObject =
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
    case Feegrant.v1beta1.BasicAllowanceTypeUrl:
      return ok({
        typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
        allowance: BasicAllowance.decode(allowance.value),
      });
    case Feegrant.v1beta1.PeriodicAllowanceTypeUrl:
      return ok({
        typeUrl: Feegrant.v1beta1.PeriodicAllowanceTypeUrl,
        allowance: PeriodicAllowance.decode(allowance.value),
      });
    case Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl:
      return ok({
        typeUrl: Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl,
        allowance: AllowedMsgAllowance.decode(allowance.value),
      });
    default:
      return err(new Error(`Unsupported allowance type: ${allowance.typeUrl}`));
  }
}
