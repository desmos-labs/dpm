import { MsgAnswerPollEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgAnswerPoll
 * @constructor
 */
const MsgAnswerPollDetails: MessageDetailsComponent<MsgAnswerPollEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.posts');

  const fields = React.useMemo(
    () => [
      {
        label: t('answers indexes'),
        value: message.value.answersIndexes.join('\n'),
      },
    ],
    [message, t],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.posts"
          i18nKey="answer poll description"
          components={[
            <CopiableAddress address={message.value.signer} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            pollId: message.value.pollId,
            postId: message.value.postId,
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgAnswerPollDetails;
