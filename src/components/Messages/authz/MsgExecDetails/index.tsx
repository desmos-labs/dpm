import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { Trans, useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { MsgExecEncodeObject } from 'types/cosmos';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { toHex } from '@cosmjs/encoding';

/**
 * Custom json serializer that serialize for the {@link Any} type.
 */
function msgExecJsonSerializer(this: Any, key: string, value: any) {
  if (key === 'value') {
    // Convert the value to a hex encoded string to have a better visualization.
    return toHex(this.value);
  }
  return value;
}

/**
 * Component that shows the details of a {@link MsgExecEncodeObject}.
 */
const MsgExecDetails: MessageDetailsComponent<MsgExecEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.authz');

  const fields = React.useMemo<MessageDetailsField[]>(
    () =>
      message.value.msgs.map((m) => ({
        label: t('executed message'),
        value: JSON.stringify(m, msgExecJsonSerializer, 2),
      })),
    [message.value.msgs, t],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          t={t}
          i18nKey="exec description"
          components={[<CopiableAddress address={message.value.grantee} />]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgExecDetails;
