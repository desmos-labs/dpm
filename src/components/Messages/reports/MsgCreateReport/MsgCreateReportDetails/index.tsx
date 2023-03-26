import { MsgCreateReportEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useGetGenerateReportTargetFields from 'components/Messages/reports/MsgCreateReport/MsgCreateReportDetails/hooks';

/**
 * Displays the full details of a MsgCreateReport
 * @constructor
 */
const MsgCreateReportDetails: MessageDetailsComponent<MsgCreateReportEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.reports');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const getGenerateReportTargetFields = useGetGenerateReportTargetFields();

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('reasons ids'),
        value: message.value.reasonsIds.toString(),
      },
      {
        label: t('message'),
        value: message.value.message,
        hide: message.value.message.length === 0,
      },
      ...getGenerateReportTargetFields(message.value.target),
      {
        label: t('reporter'),
        value: message.value.reporter,
      },
    ],
    [tSubspaces, t, message, getGenerateReportTargetFields],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('create report')} fields={fields} />
  );
};

export default MsgCreateReportDetails;
