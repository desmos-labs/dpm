import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { MsgRevokeAllowanceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

const MsgRevokeAllowanceDetails: MessageDetailsComponent<MsgRevokeAllowanceEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.feegrant');
  const { granter, grantee } = message.value;

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('revoke allowance')}
      fields={[
        {
          label: t('granter'),
          value: granter,
        },
        {
          label: t('grantee'),
          value: grantee,
        },
      ]}
    />
  );
};

export default MsgRevokeAllowanceDetails;