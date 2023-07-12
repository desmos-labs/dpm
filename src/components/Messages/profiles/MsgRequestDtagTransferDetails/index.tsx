import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { Profiles } from '@desmoslabs/desmjs';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgRequestDtagTransferDetails: MessageDetailsComponent<
  Profiles.v3.MsgRequestDTagTransferEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey={
          toBroadcastMessage
            ? 'request dtag transfer description'
            : 'requested dtag transfer description'
        }
        components={[
          <CopiableAddress address={message.value.sender} />,
          <CopiableAddress address={message.value.receiver} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRequestDtagTransferDetails;
