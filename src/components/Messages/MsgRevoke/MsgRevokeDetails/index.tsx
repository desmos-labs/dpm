import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgRevokeEncodeObject } from '@desmoslabs/desmjs';

type MsgRevokeDetailsProps = MessageDetailsComponentProps<MsgRevokeEncodeObject>;

const MsgRevokeDetails: React.FC<MsgRevokeDetailsProps> = ({ message }) => {
  const { t } = useTranslation('messages.authz');
  const { t: tFeeGrant } = useTranslation('messages.feegrant');

  const computedFields = React.useMemo(() => {
    const fields = [
      {
        label: tFeeGrant('granter'),
        value: message.value.granter,
      },
      {
        label: tFeeGrant('grantee'),
        value: message.value.grantee,
      },
    ];

    if (message.value.msgTypeUrl !== undefined) {
      fields.push({
        label: t('authorization'),
        value: message.value.msgTypeUrl,
      });
    }

    return fields;
  }, [message.value.grantee, message.value.granter, message.value.msgTypeUrl, t, tFeeGrant]);

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('revoke grant')}
      fields={computedFields}
    />
  );
};

export default MsgRevokeDetails;
