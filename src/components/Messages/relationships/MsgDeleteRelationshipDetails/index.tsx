import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans } from 'react-i18next';
import { MsgDeleteRelationshipEncodeObject } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

const MsgDeleteRelationshipDetails: MessageDetailsComponent<MsgDeleteRelationshipEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.relationships"
        i18nKey={
          toBroadcastMessage
            ? 'delete relationship description'
            : 'deleted relationship description'
        }
        components={[
          <CopiableAddress address={message.value.signer} />,
          <CopiableAddress address={message.value.counterparty} />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgDeleteRelationshipDetails;
