import { MsgDeleteSectionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgDeleteSection
 * @constructor
 */
const MsgDeleteSectionDetails: MessageDetailsComponent<MsgDeleteSectionEncodeObject> = ({
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
    ],
    [t, message],
  );

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgDeleteSectionDetails;
