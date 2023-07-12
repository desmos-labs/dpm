import { Reactions } from '@desmoslabs/desmjs';
import {
  FreeTextValue,
  RegisteredReactionValue,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { err, ok, Result } from 'neverthrow';

export interface FreeTextValueReactionEncodeObject {
  readonly typeUrl: typeof Reactions.v1.FreeTextValueTypeUrl;
  readonly value: FreeTextValue;
}

export interface RegisteredReactionValueEncodeObject {
  readonly typeUrl: typeof Reactions.v1.RegisteredReactionValueTypeUrl;
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
    case Reactions.v1.FreeTextValueTypeUrl:
      return ok({
        typeUrl: Reactions.v1.FreeTextValueTypeUrl,
        value: FreeTextValue.decode(value.value),
      });

    case Reactions.v1.RegisteredReactionValueTypeUrl:
      return ok({
        typeUrl: Reactions.v1.RegisteredReactionValueTypeUrl,
        value: RegisteredReactionValue.decode(value.value),
      });

    default:
      return err(new Error(`Unknown reaction value type: ${value.typeUrl}`));
  }
}
