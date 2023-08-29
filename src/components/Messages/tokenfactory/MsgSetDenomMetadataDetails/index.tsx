import { TokenFactory } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { isArrayEmptyOrUndefined, isStringEmptyOrUndefined } from 'lib/AssertionUtils';

/**
 * Displays the full details of a MsgSetDenomMetadata
 * @constructor
 */
const MsgSetDenomMetadataDetails: MessageDetailsComponent<
  TokenFactory.v1.MsgSetDenomMetadataEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const { t } = useTranslation('messages.tokenfactory');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: t('name'),
        value: message.value.metadata?.name,
        hide: isStringEmptyOrUndefined(message.value.metadata?.name),
      },
      {
        label: t('description'),
        value: message.value.metadata?.description,
        hide: isStringEmptyOrUndefined(message.value.metadata?.description),
      },
      {
        label: t('base'),
        value: message.value.metadata?.base,
        hide: isStringEmptyOrUndefined(message.value.metadata?.base),
      },
      {
        label: t('display'),
        value: message.value.metadata?.display,
        hide: isStringEmptyOrUndefined(message.value.metadata?.display),
      },
      {
        label: t('symbol'),
        value: message.value.metadata?.symbol,
        hide: isStringEmptyOrUndefined(message.value.metadata?.symbol),
      },
      {
        label: t('denom units'),
        value: message.value.metadata?.denomUnits
          ?.map((u) => `Denom: ${u.denom} Exp: ${u.exponent}`)
          .join('\n'),
        hide: isArrayEmptyOrUndefined(message.value.metadata?.denomUnits),
      },
      {
        label: t('uri'),
        value: message.value.metadata?.uri,
        hide: isStringEmptyOrUndefined(message.value.metadata?.uri),
      },
      {
        label: t('uri hash'),
        value: message.value.metadata?.uriHash,
        hide: isStringEmptyOrUndefined(message.value.metadata?.uriHash),
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.tokenfactory"
          i18nKey={
            toBroadcastMessage
              ? 'set denom metadata description'
              : 'user set denom metadata description'
          }
          components={[
            <CopiableAddress address={message.value.sender} />,
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

export default MsgSetDenomMetadataDetails;
