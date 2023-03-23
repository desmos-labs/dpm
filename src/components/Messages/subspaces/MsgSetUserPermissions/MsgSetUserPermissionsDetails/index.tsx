import { MsgSetUserPermissionsEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgSetUserPermissions
 * @constructor
 */
const MsgSetUserPermissionsDetails: MessageDetailsComponent<MsgSetUserPermissionsEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('section id'),
        value: message.value.sectionId.toString(),
      },
      {
        label: t('group id'),
        value: message.value.user,
      },
      {
        label: t('permissions'),
        value: message.value.permissions.join('\n'),
      },
      {
        label: t('signer'),
        value: message.value.signer,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('set user permissions')}
      fields={fields}
    />
  );
};

export default MsgSetUserPermissionsDetails;
