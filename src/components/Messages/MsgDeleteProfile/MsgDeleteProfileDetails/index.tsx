import React from 'react';
import { MsgDeleteProfileEncodeObject } from '@desmoslabs/desmjs';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

export type MsgDeleteProfileDetailsProps = {
  message: MsgDeleteProfileEncodeObject;
};

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgLinkChainAccountDetails = (props: MsgDeleteProfileDetailsProps) => {
  const { t } = useTranslation('messages.profiles');

  const { message } = props;
  const { value } = message;

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      fields={[
        {
          label: t('creator'),
          value: value.creator,
        },
      ]}
    />
  );
};

export default MsgLinkChainAccountDetails;
