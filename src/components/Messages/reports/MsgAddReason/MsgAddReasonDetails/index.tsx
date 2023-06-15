import { MsgAddReasonEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgAddReason
 * @constructor
 */
const MsgAddReasonDetails: MessageDetailsComponent<MsgAddReasonEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.reports');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tCommon } = useTranslation('messages.common');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
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
      {
        label: tCommon('signer'),
        value: message.value.signer,
      },
    ],
    [tSubspaces, t, message, tCommon],
  );

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgAddReasonDetails;
