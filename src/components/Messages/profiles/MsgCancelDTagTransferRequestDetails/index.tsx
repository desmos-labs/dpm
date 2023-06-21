import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import { MsgCancelDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgCancelDTagTransferDetails: MessageDetailsComponent<
  MsgCancelDTagTransferRequestEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey={
          toBroadcastMessage
            ? 'cancel dtag transfer description'
            : 'canceled dtag transfer description'
        }
        components={[
          <CopiableAddress address={message.value.sender} />,
          <CopiableAddress address={message.value.receiver} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgCancelDTagTransferDetails;
