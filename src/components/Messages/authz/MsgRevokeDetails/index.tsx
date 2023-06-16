import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans, useTranslation } from 'react-i18next';
import { MsgRevokeEncodeObject } from '@desmoslabs/desmjs';
import CopiableAddress from 'components/CopiableAddress';
import Typography from 'components/Typography';

type MsgRevokeDetailsProps = MessageDetailsComponentProps<MsgRevokeEncodeObject>;

const MsgRevokeDetails: React.FC<MsgRevokeDetailsProps> = ({ message }) => {
  const { t } = useTranslation('messages.authz');

  const computedFields = React.useMemo(
    () =>
      message.value.msgTypeUrl !== undefined
        ? [
            {
              label: t('removed authorization'),
              value: message.value.msgTypeUrl,
            },
          ]
        : undefined,
    [message.value.msgTypeUrl, t],
  );

  return (
    <BaseMessageDetails message={message} fields={computedFields}>
      <Typography.Regular14>
        <Trans
          ns={'messages.authz'}
          i18nKey={'grant revoke description'}
          components={[
            <CopiableAddress address={message.value.granter} />,
            <CopiableAddress address={message.value.grantee} />,
          ]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgRevokeDetails;
