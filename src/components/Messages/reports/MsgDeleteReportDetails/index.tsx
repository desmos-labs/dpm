import { Reports } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgDeleteReport
 * @constructor
 */
const MsgDeleteReportDetails: MessageDetailsComponent<Reports.v1.MsgDeleteReportEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.reports"
        i18nKey={toBroadcastMessage ? 'delete report description' : 'deleted report description'}
        components={[
          <CopiableAddress address={message.value.signer} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
          reportId: message.value.reportId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgDeleteReportDetails;
