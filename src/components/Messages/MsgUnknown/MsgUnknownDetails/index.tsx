import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgUnknownIcon } from 'assets/images';

export type MsgUnknownDetailsProps = {
  message: EncodeObject;
};

/**
 * Displays the full details of an MsgUnknown message.
 * @constructor
 */
export const MsgUnknownDetails = (props: MsgUnknownDetailsProps) => {
  const { t } = useTranslation('messages.unknown');
  const { message } = props;

  return (
    <BaseMessageDetails
      icon={msgUnknownIcon}
      iconSubtitle={message.typeUrl.split('.').pop()}
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
