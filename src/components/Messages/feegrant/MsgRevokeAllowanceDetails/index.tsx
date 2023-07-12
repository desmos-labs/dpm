import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { Feegrant } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import CopiableAddress from 'components/CopiableAddress';
import Typography from 'components/Typography';

const MsgRevokeAllowanceDetails: MessageDetailsComponent<
  Feegrant.v1beta1.MsgRevokeAllowanceEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { granter, grantee } = message.value;

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.feegrant"
          i18nKey={
            toBroadcastMessage
              ? 'revoke grant allowance description'
              : 'revoked grant allowance description'
          }
          components={[
            <CopiableAddress address={granter} />,
            <CopiableAddress address={grantee} />,
          ]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgRevokeAllowanceDetails;
