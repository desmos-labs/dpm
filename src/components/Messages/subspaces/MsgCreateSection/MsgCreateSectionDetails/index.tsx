import { MsgCreateSectionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgCreateSection
 * @constructor
 */
const MsgCreateSectionDetails: MessageDetailsComponent<MsgCreateSectionEncodeObject> = ({
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
        label: t('name'),
        value: message.value.name,
      },
      {
        label: t('description'),
        value: message.value.description,
      },
      {
        label: t('parent id'),
        value: message.value.parentId?.toString(),
      },
      {
        label: t('creator'),
        value: message.value.creator,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('create section')} fields={fields} />
  );
};

export default MsgCreateSectionDetails;
