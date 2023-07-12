import { Reactions } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import useGetReactionValueFields from './hooks';

/**
 * Displays the full details of a MsgAddReaction
 * @constructor
 */
const MsgAddReactionDetails: MessageDetailsComponent<Reactions.v1.MsgAddReactionEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const getReactionValueFields = useGetReactionValueFields();
  const fields = React.useMemo(
    () => getReactionValueFields(message.value.value),
    [getReactionValueFields, message.value.value],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.reactions"
          i18nKey={toBroadcastMessage ? 'add reaction description' : 'added reaction description'}
          components={[
            <CopiableAddress address={message.value.user} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            postId: message.value.postId,
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgAddReactionDetails;
