import { Profiles } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgUnlinkChainAccount
 * @constructor
 */
const MsgUnlinkChainAccountDetails: MessageDetailsComponent<
  Profiles.v3.MsgUnlinkChainAccountEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.profiles"
        i18nKey={
          toBroadcastMessage
            ? 'unlink chain account description'
            : 'unlinked chain account description'
        }
        components={[
          <CopiableAddress address={message.value.owner} />,
          <Typography.SemiBold14 />,
          <CopiableAddress address={message.value.target} />,
        ]}
        values={{
          chain: message.value.chainName,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgUnlinkChainAccountDetails;
