import { Posts } from '@desmoslabs/desmjs';
import { Media, Poll } from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { err, ok, Result } from 'neverthrow';

interface MediaPostAttachmentEncodeObject {
  readonly typeUrl: typeof Posts.v3.MediaTypeUrl;
  readonly value: Media;
}

interface PollPostAttachmentEncodeObject {
  readonly typeUrl: typeof Posts.v3.PollTypeUrl;
  readonly value: Poll;
}

type PostAttachmentEncodeObject = MediaPostAttachmentEncodeObject | PollPostAttachmentEncodeObject;

/**
 * Function to decode a raw post attachment.
 * @param attachment - The raw post attachment to decode.
 */
export function decodePostAttachment(attachment: Any): Result<PostAttachmentEncodeObject, Error> {
  switch (attachment.typeUrl) {
    case Posts.v3.MediaTypeUrl:
      return ok({
        typeUrl: Posts.v3.MediaTypeUrl,
        value: Media.decode(attachment.value),
      });
    case Posts.v3.PollTypeUrl:
      return ok({
        typeUrl: Posts.v3.PollTypeUrl,
        value: Poll.decode(attachment.value),
      });
    default:
      return err(new Error(`Invalid attachment type ${attachment.typeUrl}`));
  }
}
