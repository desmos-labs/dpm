import { MsgEditSectionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgEditSection
 * @constructor
 */
const MsgEditSectionDetails: MessageDetailsComponent<MsgEditSectionEncodeObject> = ({
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
        label: t('name'),
        value: message.value.name,
      },
      {
        label: t('description'),
        value: message.value.description,
      },
      {
        label: t('editor'),
        value: message.value.editor,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('edit section')} fields={fields} />
  );
};

export default MsgEditSectionDetails;
