import { MsgAddReasonEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgAddReason
 * @constructor
 */
const MsgAddReasonDetails: MessageDetailsComponent<MsgAddReasonEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.reports');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: t('title'),
        value: message.value.title,
        hide: message.value.title.length === 0,
      },
      {
        label: t('description'),
        value: message.value.description,
        hide: message.value.description.length === 0,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.reports"
          i18nKey={toBroadcastMessage ? 'add reason description' : 'added reason description'}
          components={[
            <CopiableAddress address={message.value.signer} />,
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

export default MsgAddReasonDetails;
