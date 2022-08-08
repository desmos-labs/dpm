import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: MsgUnlinkChainAccountEncodeObject["value"];
  date: Date;
};

/**
 * Displays the short details of a MsgUnlinkChainAccount within a list.
 * @constructor
 */
export const MessageUnlinkChainAccountListItem: React.FC<Props> = ({ message, date }) => {
  const { t } = useTranslation();

  return (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/general.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type unlink chain account')}</Typography.Body1>
          <View style={{ flexDirection: 'row', flexShrink: 1 }}>
            <Typography.Caption>{message.target}</Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};
