import { MsgSupportStandardReasonEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgSupportStandardReason
 * @constructor
 */
const MsgSupportStandardReasonDetails: MessageDetailsComponent<
  MsgSupportStandardReasonEncodeObject
> = ({ message }) => {
  const { t } = useTranslation('messages.reports');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tCommon } = useTranslation('messages.common');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('standard reason id'),
        value: message.value.standardReasonId.toString(),
      },
      {
        label: tCommon('signer'),
        value: message.value.signer,
      },
    ],
    [tSubspaces, t, message, tCommon],
  );

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.reports"
          i18nKey="support standard reason description"
          components={[
            <CopiableAddress address={message.value.signer} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            reasonId: message.value.standardReasonId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgSupportStandardReasonDetails;
