import { Subspaces } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { formatCoins } from 'lib/FormatUtils';

/**
 * Displays the full details of a MsgUpdateSubspaceFeeTokens
 * @constructor
 */
const MsgUpdateSubspaceFeeTokensDetails: MessageDetailsComponent<
  Subspaces.v3.MsgUpdateSubspaceFeeTokensEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('fee tokens'),
        value: formatCoins(message.value.additionalFeeTokens),
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.subspaces"
          i18nKey={
            toBroadcastMessage ? 'update subspace fee token' : 'user updated subspace fee token'
          }
          components={[
            <CopiableAddress address={message.value.authority} />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgUpdateSubspaceFeeTokensDetails;
