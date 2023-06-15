import { MsgRemoveReasonEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgRemoveReason
 * @constructor
 */
const MsgRemoveReasonDetails: MessageDetailsComponent<MsgRemoveReasonEncodeObject> = ({
  message,
}) => {
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
        label: t('reason id'),
        value: message.value.reasonId.toString(),
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

export default MsgRemoveReasonDetails;
