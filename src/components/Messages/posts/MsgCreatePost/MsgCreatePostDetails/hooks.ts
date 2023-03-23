import { useTranslation } from 'react-i18next';
import { MsgCreatePost } from '@desmoslabs/desmjs-types/desmos/posts/v2/msgs';
import React from 'react';
import { MessageDetailsField } from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Media, Poll } from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import { MediaTypeUrl, PollTypeUrl, timestampToDate } from '@desmoslabs/desmjs';
import { format } from 'date-fns';

const useGetMediaAttachmentFields = () => {
  const { t } = useTranslation('messages.posts');

  return React.useCallback(
    (m: Media): MessageDetailsField[] => [
      {
        label: t('media attachment'),
        value: m.uri,
      },
      {
        label: t('media mime type'),
        value: m.mimeType,
      },
    ],
    [t],
  );
};

const useGetPollAttachmentFields = () => {
  const { t } = useTranslation('messages.posts');

  return React.useCallback(
    (p: Poll): MessageDetailsField[] => [
      {
        label: t('poll question'),
        value: p.question,
      },
      {
        label: t('poll answers'),
        value: p.providedAnswers.map((a) => a.text).join('\n'),
        hide: p.providedAnswers.length === 0,
      },
      {
        label: t('poll end date'),
        value: p.endDate ? format(timestampToDate(p.endDate), 'dd MMM yyyy HH:mm') : undefined,
        hide: p.endDate === undefined,
      },
      {
        label: t('poll allow answer edit'),
        value: p.allowsAnswerEdits.toString(),
      },
      {
        label: t('poll allow multiple answers'),
        value: p.allowsMultipleAnswers.toString(),
      },
    ],
    [t],
  );
};

export const useGetAttachmentsFields = () => {
  const { t } = useTranslation('messages.posts');
  const getMediaAttachmentFields = useGetMediaAttachmentFields();
  const getPollAttachmentFields = useGetPollAttachmentFields();

  return React.useCallback(
    (msg: MsgCreatePost): MessageDetailsField[] => {
      const fields: MessageDetailsField[] = [];

      msg.attachments.forEach((a) => {
        switch (a.typeUrl) {
          case MediaTypeUrl:
            fields.push(...getMediaAttachmentFields(Media.decode(a.value)));
            break;

          case PollTypeUrl:
            fields.push(...getPollAttachmentFields(Poll.decode(a.value)));
            break;

          default:
            fields.push({
              label: t('unknown attachment type'),
              value: a.typeUrl,
            });
        }
      });

      return fields;
    },
    [getMediaAttachmentFields, getPollAttachmentFields, t],
  );
};
