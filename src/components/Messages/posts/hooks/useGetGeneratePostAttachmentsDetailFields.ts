import { useTranslation } from 'react-i18next';
import React from 'react';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { MessageDetailsField } from 'components/Messages/BaseMessage/BaseMessageDetails';
import { TFunction } from 'i18next';
import { MediaTypeUrl, PollTypeUrl, timestampToDate } from '@desmoslabs/desmjs';
import { decodePostAttachment } from 'lib/EncodeObjectUtils/postattachment';
import { format } from 'date-fns';

function generateAttachmentFields(
  attachment: Any | undefined,
  t: TFunction<'messages.posts', undefined, 'messages.posts'>,
): MessageDetailsField[] {
  if (attachment === undefined) {
    return [];
  }

  const decodeResult = decodePostAttachment(attachment);

  if (decodeResult.isErr()) {
    return [
      {
        label: t('unknown attachment type'),
        value: attachment.typeUrl,
      },
    ];
  }

  const decodedAttachment = decodeResult.value;

  switch (decodedAttachment.typeUrl) {
    case PollTypeUrl:
      return [
        {
          label: t('poll question'),
          value: decodedAttachment.value.question,
        },
        {
          label: t('poll answers'),
          value: decodedAttachment.value.providedAnswers.map((a) => a.text).join('\n'),
          hide: decodedAttachment.value.providedAnswers.length === 0,
        },
        ...decodedAttachment.value.providedAnswers.flatMap((pollAnswer) =>
          pollAnswer.attachments.flatMap((pollAttachment) =>
            generateAttachmentFields(pollAttachment, t),
          ),
        ),
        {
          label: t('poll end date'),
          value: decodedAttachment.value.endDate
            ? format(timestampToDate(decodedAttachment.value.endDate), 'dd MMM yyyy HH:mm')
            : undefined,
          hide: decodedAttachment.value.endDate === undefined,
        },
        {
          label: t('poll allow answer edit'),
          value: decodedAttachment.value.allowsAnswerEdits.toString(),
        },
        {
          label: t('poll allow multiple answers'),
          value: decodedAttachment.value.allowsMultipleAnswers.toString(),
        },
      ];
    case MediaTypeUrl:
      return [
        {
          label: t('media attachment'),
          value: decodedAttachment.value.uri,
        },
        {
          label: t('media mime type'),
          value: decodedAttachment.value.mimeType,
        },
      ];
    default:
      return [
        {
          label: t('unknown attachment type'),
          value: attachment.typeUrl,
        },
      ];
  }
}

const useGetGeneratePostAttachmentsDetailFields = () => {
  const { t } = useTranslation('messages.posts');

  return React.useCallback(
    (attachment: Any | undefined): MessageDetailsField[] => generateAttachmentFields(attachment, t),
    [t],
  );
};

export default useGetGeneratePostAttachmentsDetailFields;
