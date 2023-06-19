import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans, useTranslation } from 'react-i18next';
import { MsgLinkApplicationEncodeObject } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { formatIbcTimeoutTimestamp } from 'lib/FormatUtils';

const MsgLinkApplicationDetails: MessageDetailsComponent<MsgLinkApplicationEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const fields = React.useMemo(
    () => [
      {
        label: t('call data'),
        value: message.value.callData,
      },
      {
        label: t('source channel'),
        value: message.value.sourceChannel,
      },
      {
        label: t('source port'),
        value: message.value.sourcePort,
      },
      {
        label: t('timeout height'),
        value: message.value.timeoutHeight?.revisionHeight?.toString(),
      },
      {
        label: t('timeout timestamp'),
        value: formatIbcTimeoutTimestamp(message.value.timeoutTimestamp),
      },
    ],
    [t, message.value],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.profiles"
          i18nKey="link application description"
          components={[
            <CopiableAddress address={message.value.sender} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            application: message.value.linkData?.application,
            username: message.value.linkData?.username,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgLinkApplicationDetails;
