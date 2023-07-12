import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans, useTranslation } from 'react-i18next';
import { Profiles } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { formatIbcTimeoutTimestamp } from 'lib/FormatUtils';

const MsgLinkApplicationDetails: MessageDetailsComponent<
  Profiles.v3.MsgLinkApplicationEncodeObject
> = ({ message, toBroadcastMessage }) => {
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
        label: t('messages.ibc:timeout height'),
        value: t('messages.ibc:timeout height details', {
          height: message.value.timeoutHeight?.revisionHeight,
          revision: message.value.timeoutHeight?.revisionNumber,
        }),
        hide: message.value.timeoutHeight === undefined,
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
          i18nKey={
            toBroadcastMessage ? 'link application description' : 'linked application description'
          }
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
