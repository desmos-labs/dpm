import React from 'react';
import { MsgDeleteProfileEncodeObject } from '@desmoslabs/desmjs';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgDeleteProfileDetails: MessageDetailsComponent<MsgDeleteProfileEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const { value } = message;

  return (
    <BaseMessageDetails
      message={message}
      fields={[
        {
          label: t('creator'),
          value: value.creator,
        },
      ]}
    />
  );
};

export default MsgDeleteProfileDetails;
