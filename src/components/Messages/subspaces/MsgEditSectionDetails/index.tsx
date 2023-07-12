import { Subspaces } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgEditSection
 * @constructor
 */
const MsgEditSectionDetails: MessageDetailsComponent<Subspaces.v3.MsgEditSectionEncodeObject> = ({
  message,
  toBroadcastMessage,
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
          i18nKey={toBroadcastMessage ? 'edit section description' : 'edited section description'}
          components={[
            <CopiableAddress address={message.value.editor} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            sectionId: message.value.sectionId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgEditSectionDetails;
