import { MsgCreateSectionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgCreateSection
 * @constructor
 */
const MsgCreateSectionDetails: MessageDetailsComponent<MsgCreateSectionEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('description'),
        value: message.value.description,
        hide: message.value.description?.length === 0,
      },
      {
        label: t('parent id'),
        value: message.value.parentId?.toString(),
        hide: message.value.parentId === undefined,
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
            toBroadcastMessage ? 'create section description' : 'created section description'
          }
          components={[
            <CopiableAddress address={message.value.creator} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            name: message.value.name,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgCreateSectionDetails;
