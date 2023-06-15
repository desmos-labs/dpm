import { MsgAddRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgAddRegisteredReaction
 * @constructor
 */
const MsgAddRegisteredReactionDetails: MessageDetailsComponent<
  MsgAddRegisteredReactionEncodeObject
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
        label: t('shorthand code'),
        value: message.value.shorthandCode,
      },
      {
        label: t('display value'),
        value: message.value.displayValue,
      },
      {
        label: tCommon('user'),
        value: message.value.user,
      },
    ],
    [tSubspaces, message, t, tCommon],
  );

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgAddRegisteredReactionDetails;
