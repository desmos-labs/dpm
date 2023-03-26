import { MsgDeleteReportEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgDeleteReport
 * @constructor
 */
const MsgDeleteReportDetails: MessageDetailsComponent<MsgDeleteReportEncodeObject> = ({
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
        label: t('report id'),
        value: message.value.reportId.toString(),
      },
      {
        label: tCommon('signer'),
        value: message.value.signer,
      },
    ],
    [tSubspaces, t, message, tCommon],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('delete report')} fields={fields} />
  );
};

export default MsgDeleteReportDetails;
