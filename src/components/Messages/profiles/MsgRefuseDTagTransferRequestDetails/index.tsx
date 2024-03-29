import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import { Profiles } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgRefuseDTagTransferDetails: MessageDetailsComponent<
  Profiles.v3.MsgRefuseDTagTransferRequestEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey={
          toBroadcastMessage
            ? 'refuse dtag transfer description'
            : 'refused dtag transfer description'
        }
        components={[
          <CopiableAddress address={message.value.receiver} />,
          <CopiableAddress address={message.value.sender} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRefuseDTagTransferDetails;
