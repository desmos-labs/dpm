import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans, useTranslation } from 'react-i18next';
import { Relationships } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgBlockUserDetails: MessageDetailsComponent<Relationships.v1.MsgBlockUserEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.profiles');

  const fields = React.useMemo(
    () => [
      {
        label: t('block reason'),
        value: message.value.reason,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.relationships"
          i18nKey={toBroadcastMessage ? 'block user description' : 'blocked user description'}
          components={[
            <CopiableAddress address={message.value.blocker} />,
            <CopiableAddress address={message.value.blocked} />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgBlockUserDetails;
