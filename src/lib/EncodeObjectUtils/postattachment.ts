import { MediaTypeUrl, PollTypeUrl } from '@desmoslabs/desmjs';
import { Media, Poll } from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { err, ok, Result } from 'neverthrow';

export interface MediaPostAttachmentEncodeObject {
  readonly typeUrl: typeof MediaTypeUrl;
  readonly value: Media;
}

export interface PollPostAttachmentEncodeObject {
  readonly typeUrl: typeof PollTypeUrl;
  readonly value: Poll;
}

export type PostAttachmentEncodeObject =
  | MediaPostAttachmentEncodeObject
  | PollPostAttachmentEncodeObject;

/**
 * Function to decode a raw post attachment.
 * @param attachment - The raw post attachment to decode.
 */
export function decodePostAttachment(attachment: Any): Result<PostAttachmentEncodeObject, Error> {
  switch (attachment.typeUrl) {
    case MediaTypeUrl:
      return ok({
        typeUrl: MediaTypeUrl,
        value: Media.decode(attachment.value),
      });
    case PollTypeUrl:
      return ok({
        typeUrl: PollTypeUrl,
        value: Poll.decode(attachment.value),
      });
    default:
      return err(new Error(`Invalid attachment type ${attachment.typeUrl}`));
  }
}
