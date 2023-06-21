import { MsgEditUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgEditUserGroup
 * @constructor
 */
const MsgEditUserGroupDetails: MessageDetailsComponent<MsgEditUserGroupEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('name'),
        value: message.value.name,
        hide: message.value.name === undefined || message.value.name === '',
      },
      {
        label: t('description'),
        value: message.value.description,
        hide: message.value.description === undefined || message.value.description === '',
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.subspaces"
          i18nKey={
            toBroadcastMessage ? 'edit user group description' : 'edited user group description'
          }
          components={[
            <CopiableAddress address={message.value.signer} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            groupId: message.value.groupId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgEditUserGroupDetails;
