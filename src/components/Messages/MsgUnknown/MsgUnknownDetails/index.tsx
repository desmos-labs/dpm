import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of an MsgUnknown message.
 * @constructor
 */
export const MsgUnknownDetails: MessageDetailsComponent<EncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.unknown');

  return (
    <BaseMessageDetails
      message={message}
      fields={[
        {
          label: t('message type'),
          value: message.typeUrl,
        },
        {
          label: t('message value'),
          value: JSON.stringify(message.value),
        },
      ]}
    />
  );
};

export default MsgUnknownDetails;
