import React from 'react';
import { Profiles } from '@desmoslabs/desmjs';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgDeleteProfileDetails: MessageDetailsComponent<
  Profiles.v3.MsgDeleteProfileEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { value } = message;

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.profiles"
          i18nKey={
            toBroadcastMessage ? 'delete profile description' : 'deleted profile description'
          }
          components={[<CopiableAddress address={value.creator} />]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgDeleteProfileDetails;
