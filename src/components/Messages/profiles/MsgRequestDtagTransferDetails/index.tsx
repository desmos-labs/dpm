import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { MsgRequestDTagTransferEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgRequestDtagTransferDetails: MessageDetailsComponent<
  MsgRequestDTagTransferEncodeObject
> = ({ message }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey="request dtag transfer description"
        components={[
          <CopiableAddress address={message.value.sender} />,
          <CopiableAddress address={message.value.receiver} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRequestDtagTransferDetails;
