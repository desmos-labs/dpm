import { MsgSetReactionsParamsEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgSetReactionsParams
 * @constructor
 */
const MsgSetReactionsDetails: MessageDetailsComponent<MsgSetReactionsParamsEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.reactions');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tCommon } = useTranslation('messages.common');

  const fields = React.useMemo(
    (): MessageDetailsField[] => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
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
      {
        label: tCommon('user'),
        value: message.value.user,
      },
    ],
    [t, tSubspaces, message, tCommon],
  );

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('set reactions params')}
      fields={fields}
    />
  );
};

export default MsgSetReactionsDetails;
