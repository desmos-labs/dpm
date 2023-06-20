import { MsgSetUserGroupPermissionsEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgSetUserGroupPermissions
 * @constructor
 */
const MsgSetUserGroupPermissionsDetails: MessageDetailsComponent<
  MsgSetUserGroupPermissionsEncodeObject
> = ({ message }) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('permissions'),
        value: message.value.permissions.join('\n'),
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.subspaces"
          i18nKey="set user group permissions description"
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

export default MsgSetUserGroupPermissionsDetails;
