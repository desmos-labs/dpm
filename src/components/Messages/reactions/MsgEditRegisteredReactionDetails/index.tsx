import { Reactions } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgEditRegisteredReaction
 * @constructor
 */
const MsgEditRegisteredReactionDetails: MessageDetailsComponent<
  Reactions.v1.MsgEditRegisteredReactionEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { t } = useTranslation('messages.reactions');

  const fields = React.useMemo(
    () => [
      {
        label: t('shorthand code'),
        value: message.value.shorthandCode,
      },
      {
        label: t('display value'),
        value: message.value.displayValue,
      },
    ],
    [message, t],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.reactions"
          i18nKey={
            toBroadcastMessage
              ? 'edit registered reaction description'
              : 'edited registered reaction description'
          }
          components={[
            <CopiableAddress address={message.value.user} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            reactionId: message.value.registeredReactionId,
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgEditRegisteredReactionDetails;
