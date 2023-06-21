import { MsgMoveSectionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgMoveSection
 * @constructor
 */
const MsgMoveSectionDetails: MessageDetailsComponent<MsgMoveSectionEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.subspaces"
        i18nKey={toBroadcastMessage ? 'move section description' : 'moved section description'}
        components={[
          <CopiableAddress address={message.value.signer} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
          sectionId: message.value.sectionId,
          newParentId: message.value.newParentId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgMoveSectionDetails;
