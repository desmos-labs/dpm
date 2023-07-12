import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans, useTranslation } from 'react-i18next';
import { Authz } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { useGrantFields } from './hooks';

const MsgGrantDetails: MessageDetailsComponent<Authz.v1beta1.MsgGrantEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.authz');
  const grantFields = useGrantFields(message.value.grant);

  return (
    <BaseMessageDetails message={message} fields={grantFields}>
      <Typography.Regular14>
        <Trans
          t={t}
          i18nKey={
            toBroadcastMessage ? 'grant allowance description' : 'granted allowance description'
          }
          components={[
            <CopiableAddress address={message.value.granter} />,
            <CopiableAddress address={message.value.grantee} />,
          ]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgGrantDetails;
