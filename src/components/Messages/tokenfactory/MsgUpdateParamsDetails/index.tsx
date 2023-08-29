import { TokenFactory } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { isArrayEmptyOrUndefined } from 'lib/AssertionUtils';

/**
 * Displays the full details of a MsgUpdateParams
 * @constructor
 */
const MsgUpdateParamsDetails: MessageDetailsComponent<
  TokenFactory.v1.MsgUpdateParamsEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { t } = useTranslation('messages.tokenfactory');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: t('default send enabled'),
        value: message.value.params?.defaultSendEnabled ? 'true' : 'false',
        hide: message.value.params?.defaultSendEnabled === undefined,
      },
      {
        label: t('send enabled'),
        value: message.value.params?.sendEnabled
          ?.map((se) => `${se.denom}: ${se.enabled}`)
          .join('\n'),
        hide: isArrayEmptyOrUndefined(message.value.params?.sendEnabled),
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.tokenfactory"
          i18nKey={
            toBroadcastMessage ? 'update params description' : 'user updated params description'
          }
          components={[<CopiableAddress address={message.value.authority} />]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgUpdateParamsDetails;
