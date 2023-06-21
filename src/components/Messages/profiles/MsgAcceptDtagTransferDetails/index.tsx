import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { MsgAcceptDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgAcceptDtagTransferDetails: MessageDetailsComponent<
  MsgAcceptDTagTransferRequestEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { t } = useTranslation('messages.profiles');
  const fields = React.useMemo(
    () => [
      {
        label: t('new dtag'),
        value: message.value.newDtag,
      },
    ],
    [t, message.value.newDtag],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.profiles"
          i18nKey={
            toBroadcastMessage
              ? 'accept dtag transfer description'
              : 'accepted dtag transfer description'
          }
          components={[
            <CopiableAddress address={message.value.receiver} />,
            <CopiableAddress address={message.value.sender} />,
          ]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgAcceptDtagTransferDetails;
