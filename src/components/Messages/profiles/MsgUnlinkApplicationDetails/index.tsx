import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import { MsgUnlinkApplicationEncodeObject } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgUnlinkApplicationDetails: MessageDetailsComponent<MsgUnlinkApplicationEncodeObject> = ({
  message,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey="unlink application description"
        components={[<CopiableAddress address={message.value.signer} />, <Typography.SemiBold14 />]}
        values={{
          application: message.value.application,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgUnlinkApplicationDetails;
