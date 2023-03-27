import { MsgCreateSubspaceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgCreateSubspace
 * @constructor
 */
const MsgCreateSubspaceDetails: MessageDetailsComponent<MsgCreateSubspaceEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('name'),
        value: message.value.name,
      },
      {
        label: t('description'),
        value: message.value.description,
      },
      {
        label: t('treasury'),
        value: message.value.treasury,
      },
      {
        label: t('creator'),
        value: message.value.creator,
      },
      {
        label: t('owner'),
        value: message.value.owner,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('create subspace')} fields={fields} />
  );
};

export default MsgCreateSubspaceDetails;
