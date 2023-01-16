import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { formatMultiSendInput } from 'lib/FormatUtils';
import { MsgMultiSendEncodeObject } from '@desmoslabs/desmjs';

export type MsgMultiSendListItemProps = {
  message: MsgMultiSendEncodeObject['value'];
  date: Date;
};

/**
 * Displays the short details of a MsgMultiSend within a list.
 * @constructor
 */
const MsgMultiSendListItem = (props: MsgMultiSendListItemProps) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();
  const { message, date } = props;

  const tokenSent = useMemo(
    () => formatMultiSendInput(message.inputs, ', '),
    [message.inputs, chainInfo],
  );

  const outputAddresses = useMemo(
    () => message.outputs.map((output: { address: string }) => output.address),
    [message.outputs],
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
          <Typography.Caption>{t('to')}</Typography.Caption>
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
