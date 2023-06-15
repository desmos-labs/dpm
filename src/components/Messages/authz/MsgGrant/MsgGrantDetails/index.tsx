import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { useTranslation } from 'react-i18next';
import { MsgGrantEncodeObject } from '@desmoslabs/desmjs';
import { useGetGrantFields } from './hooks';

const MsgGrantDetails: MessageDetailsComponent<MsgGrantEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.authz');
  const { t: tFeeGrant } = useTranslation('messages.feegrant');
  const getGrantFields = useGetGrantFields();

  const computedFields = React.useMemo(() => {
    const fields: Array<MessageDetailsField> = [
      {
        label: tFeeGrant('granter'),
        value: message.value.granter,
      },
      {
        label: tFeeGrant('grantee'),
        value: message.value.grantee,
      },
    ];
    fields.push(...getGrantFields(message.value.grant));

    return fields;
  }, [
    tFeeGrant,
    message.value.granter,
    message.value.grantee,
    message.value.grant,
    getGrantFields,
  ]);

  return <BaseMessageDetails message={message} fields={computedFields} />;
};

export default MsgGrantDetails;
