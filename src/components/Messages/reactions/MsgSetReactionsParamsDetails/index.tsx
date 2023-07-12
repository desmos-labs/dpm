import { Reactions } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgSetReactionsParams
 * @constructor
 */
const MsgSetReactionsDetails: MessageDetailsComponent<
  Reactions.v1.MsgSetReactionsParamsEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { t } = useTranslation('messages.reactions');

  const fields = React.useMemo(
    (): MessageDetailsField[] => [
      {
        label: t('registered reactions enabled'),
        value: message.value.registeredReaction?.enabled?.toString(),
        hide: message.value.registeredReaction?.enabled === undefined,
      },
      {
        label: t('free text reactions enabled'),
        value: message.value.freeText?.enabled?.toString(),
        hide: message.value.freeText?.enabled === undefined,
      },
      {
        label: t('free text reactions max length'),
        value: message.value.freeText?.maxLength?.toString(),
        hide: message.value.freeText?.maxLength === undefined,
      },
      {
        label: t('free text reactions regex'),
        value: message.value.freeText?.regEx,
        hide: message.value.freeText?.regEx === undefined,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.reactions"
          i18nKey={
            toBroadcastMessage
              ? 'set reactions params description'
              : 'user set reactions params description'
          }
          components={[<CopiableAddress address={message.value.user} />, <Typography.SemiBold14 />]}
          values={{
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgSetReactionsDetails;
