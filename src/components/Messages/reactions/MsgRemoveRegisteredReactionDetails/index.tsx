import { MsgRemoveRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgRemoveRegisteredReaction
 * @constructor
 */
const MsgRemoveRegisteredReactionDetails: MessageDetailsComponent<
  MsgRemoveRegisteredReactionEncodeObject
> = ({ message }) => {
  const { t } = useTranslation('messages.reactions');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tCommon } = useTranslation('messages.common');

  const fields = React.useMemo(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('registered reaction id'),
        value: message.value.registeredReactionId.toString(),
      },
      {
        label: tCommon('user'),
        value: message.value.user,
      },
    ],
    [tSubspaces, message, t, tCommon],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.reactions"
          i18nKey="remove registered reaction description"
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

export default MsgRemoveRegisteredReactionDetails;
