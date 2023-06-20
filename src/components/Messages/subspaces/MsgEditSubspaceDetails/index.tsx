import { MsgEditSubspaceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgEditSubspace
 * @constructor
 */
const MsgEditSubspaceDetails: MessageDetailsComponent<MsgEditSubspaceEncodeObject> = ({
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
        hide: message.value.description === undefined || message.value.description === '',
      },
      {
        label: t('owner'),
        value: message.value.owner,
        hide: message.value.owner === undefined || message.value.owner === '',
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.subspaces"
          i18nKey="edit subspace description"
          components={[
            <CopiableAddress address={message.value.signer} />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgEditSubspaceDetails;
