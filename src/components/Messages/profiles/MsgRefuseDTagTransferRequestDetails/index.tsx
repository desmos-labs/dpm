import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import { MsgRefuseDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgRefuseDTagTransferDetails: MessageDetailsComponent<
  MsgRefuseDTagTransferRequestEncodeObject
> = ({ message }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey="refuse dtag transfer description"
        components={[
          <CopiableAddress address={message.value.receiver} />,
          <CopiableAddress address={message.value.sender} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRefuseDTagTransferDetails;
