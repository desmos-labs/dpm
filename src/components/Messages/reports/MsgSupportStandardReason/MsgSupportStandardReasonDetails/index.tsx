import { MsgSupportStandardReasonEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgSupportStandardReason
 * @constructor
 */
const MsgSupportStandardReasonDetails: MessageDetailsComponent<
  MsgSupportStandardReasonEncodeObject
> = ({ message }) => {
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
        label: t('standard reason id'),
        value: message.value.standardReasonId.toString(),
      },
      {
        label: tCommon('signer'),
        value: message.value.signer,
      },
    ],
    [tSubspaces, t, message, tCommon],
  );

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('support standard reason')}
      fields={fields}
    />
  );
};

export default MsgSupportStandardReasonDetails;
