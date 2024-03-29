import { MsgTransferEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { formatCoin, formatIbcTimeoutTimestamp } from 'lib/FormatUtils';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgTransfer.
 */
const MsgTransfer: MessageDetailsComponent<MsgTransferEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.ibc');
  const {
    token,
    timeoutHeight,
    timeoutTimestamp,
    sourceChannel,
    sourcePort,
    sender,
    receiver,
    memo,
  } = message.value;

  const transferAmount = useMemo(() => (token ? formatCoin(token) : ''), [token]);

  const fields: MessageDetailsField[] = React.useMemo(
    () => [
      {
        label: t('source channel'),
        value: sourceChannel,
      },
      {
        label: t('source port'),
        value: sourcePort,
      },
      {
        label: t('transaction:memo'),
        value: memo,
        hide: memo === undefined,
      },
      {
        label: t('timeout height'),
        value: t('timeout height details', {
          height: timeoutHeight?.revisionHeight,
          revision: timeoutHeight?.revisionNumber,
        }),
        hide: timeoutHeight === undefined,
      },
      {
        label: t('timeout timestamp'),
        value: formatIbcTimeoutTimestamp(timeoutTimestamp),
        hide: timeoutTimestamp === undefined,
      },
    ],
    [memo, sourceChannel, sourcePort, t, timeoutHeight, timeoutTimestamp],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns={'messages.ibc'}
          i18nKey={toBroadcastMessage ? 'ibc send description' : 'ibc sent description'}
          components={[
            <CopiableAddress address={sender} />,
            <CopiableAddress address={receiver} />,
            <Typography.SemiBold14 />,
          ]}
          values={{ transferAmount }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgTransfer;
