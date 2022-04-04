import { MsgWithdrawDelegatorRewardEncodeObject } from '@desmoslabs/sdk-core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: MsgWithdrawDelegatorRewardEncodeObject;
  date: Date;
};

export const MessageWithdrawDelegatorRewardListItem: React.FC<Props> = (props) => {
  const { encodeObject, date } = props;
  const { t } = useTranslation();

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/withdraw.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('withdraw rewards')}</Typography.Body1>
          <View style={{ flexDirection: 'row', flexShrink: 1 }}>
            <Typography.Caption>
              {t('from')} {encodeObject.value.validatorAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};
