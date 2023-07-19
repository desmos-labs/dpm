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
import { useActiveAccountAddress } from '@recoil/activeAccount';

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
const MsgExecDetails: MessageDetailsComponent<MsgExecEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.authz');

  // -------- HOOKS --------

  const activeAccountAddress = useActiveAccountAddress();

  // -------- VARIABLES --------

  const fields = React.useMemo<MessageDetailsField[]>(
    () =>
      message.value.msgs.map((m) => ({
        label: t('action'),
        value: JSON.stringify(m, msgExecJsonSerializer, 2),
      })),
    [message.value.msgs, t],
  );

  const descriptionKey = React.useMemo(() => {
    if (toBroadcastMessage) {
      return 'exec description';
    }

    return message.value.grantee === activeAccountAddress
      ? 'executed description'
      : 'other executed on your behalf description';
  }, [activeAccountAddress, message.value.grantee, toBroadcastMessage]);

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.authz"
          i18nKey={descriptionKey}
          components={[<CopiableAddress address={message.value.grantee} />]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgExecDetails;
