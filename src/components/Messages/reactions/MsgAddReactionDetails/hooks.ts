import { useTranslation } from 'react-i18next';
import React from 'react';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { MessageDetailsField } from 'components/Messages/BaseMessage/BaseMessageDetails';
import { decodeReactionValue } from 'lib/EncodeObjectUtils/reactions';
import { FreeTextValueTypeUrl, RegisteredReactionValueTypeUrl } from '@desmoslabs/desmjs';

const useGetReactionValueFields = () => {
  const { t } = useTranslation('messages.reactions');

  return React.useCallback(
    (reaction: Any | undefined): MessageDetailsField[] => {
      const decodeReactionResult = decodeReactionValue(reaction);

      if (decodeReactionResult.isErr()) {
        return [
          {
            label: t('unsupported reaction value'),
            value: reaction?.typeUrl,
          },
        ];
      }

      const decodedValue = decodeReactionResult.value;
      if (decodedValue === undefined) {
        return [];
      }

      switch (decodedValue.typeUrl) {
        case FreeTextValueTypeUrl:
          return [
            {
              label: t('free text value reaction'),
              value: decodedValue.value.text,
            },
          ];

        case RegisteredReactionValueTypeUrl:
          return [
            {
              label: t('registered reaction id'),
              value: decodedValue.value.registeredReactionId.toString(),
            },
          ];
        default:
          return [];
      }
    },
    [t],
  );
};

export default useGetReactionValueFields;
