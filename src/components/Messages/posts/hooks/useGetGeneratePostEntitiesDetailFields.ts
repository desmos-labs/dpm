import { useTranslation } from 'react-i18next';
import { Entities } from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import React from 'react';
import { MessageDetailsField } from 'components/Messages/BaseMessage/BaseMessageDetails';

const useGetGeneratePostEntitiesDetailFields = () => {
  const { t } = useTranslation('messages.posts');

  return React.useCallback(
    (entities?: Entities): MessageDetailsField[] => [
      {
        label: t('hashtags'),
        value: entities?.hashtags?.map((h) => h.tag).join('\n'),
        hide: (entities?.hashtags?.length ?? 0) === 0,
      },
      {
        label: t('mentions'),
        value: entities?.mentions?.map((m) => m.tag).join('\n'),
        hide: (entities?.mentions?.length ?? 0) === 0,
      },
      {
        label: t('urls'),
        value: entities?.urls?.map((m) => `${m.displayUrl} - ${m.url}`).join('\n'),
        hide: (entities?.urls?.length ?? 0) === 0,
      },
    ],
    [t],
  );
};

export default useGetGeneratePostEntitiesDetailFields;
