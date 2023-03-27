import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { formatMultiSendInput } from 'lib/FormatUtils';
import { MsgMultiSendEncodeObject } from '@desmoslabs/desmjs';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgMultiSend within a list.
 * @constructor
 */
const MsgMultiSendListItem: MessageDetailsComponent<MsgMultiSendEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.bank');
  const { value } = message;

  const tokenSent = useMemo(() => formatMultiSendInput(value.inputs, ', '), [value.inputs]);
  const outputAddresses = useMemo(
    () => value.outputs.map((output: { address: string }) => output.address),
    [value.outputs],
  );

  return (
    <BaseMessageListItem
      icon={require('assets/images/messages/send.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('multi send')} {tokenSent}
          </Typography.Body1>
          <Typography.Caption>{t('transaction:to')}</Typography.Caption>
          {outputAddresses.map((address, index) => (
            <Typography.Caption key={`w${index * 2}`} numberOfLines={1} ellipsizeMode="middle">
              {address}
            </Typography.Caption>
          ))}
        </View>
      )}
    />
  );
};

export default MsgMultiSendListItem;
