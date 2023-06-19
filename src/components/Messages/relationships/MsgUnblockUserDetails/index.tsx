import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import { MsgUnblockUserEncodeObject } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgUnblockUserDetails: MessageDetailsComponent<MsgUnblockUserEncodeObject> = ({
  message,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.relationships"
        i18nKey="unblock user description"
        components={[
          <CopiableAddress address={message.value.blocker} />,
          <CopiableAddress address={message.value.blocked} />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgUnblockUserDetails;
