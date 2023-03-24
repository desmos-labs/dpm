import { FreeTextValueTypeUrl, RegisteredReactionValueTypeUrl } from '@desmoslabs/desmjs';
import {
  FreeTextValue,
  RegisteredReactionValue,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { err, ok, Result } from 'neverthrow';

export interface FreeTextValueReactionEncodeObject {
  readonly typeUrl: typeof FreeTextValueTypeUrl;
  readonly value: FreeTextValue;
}

export interface RegisteredReactionValueEncodeObject {
  readonly typeUrl: typeof RegisteredReactionValueTypeUrl;
  readonly value: RegisteredReactionValue;
}

export type ReactionValueEncodeObject =
  | FreeTextValueReactionEncodeObject
  | RegisteredReactionValueEncodeObject;

export function decodeReactionValue(
  value: Any | undefined,
): Result<ReactionValueEncodeObject | undefined, Error> {
  if (value === undefined) {
    return ok(undefined);
  }

  switch (value.typeUrl) {
    case FreeTextValueTypeUrl:
      return ok({
        typeUrl: FreeTextValueTypeUrl,
        value: FreeTextValue.decode(value.value),
      });

    case RegisteredReactionValueTypeUrl:
      return ok({
        typeUrl: RegisteredReactionValueTypeUrl,
        value: RegisteredReactionValue.decode(value.value),
      });

    default:
      return err(new Error(`Unknown reaction value type: ${value.typeUrl}`));
  }
}
