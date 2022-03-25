import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/sdk-core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: MsgUnlinkChainAccountEncodeObject;
  date: Date;
};

export const MessageUnlinkChainAccountListItem: React.FC<Props> = (props) => {
  const { date, encodeObject } = props;
  const { target } = encodeObject.value;
  const { t } = useTranslation();

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/general.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type unlink chain account')}</Typography.Body1>
          <View style={{ flexDirection: 'row', flexShrink: 1 }}>
            <Typography.Caption>{target}</Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};
