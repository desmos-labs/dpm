import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: MsgSaveProfileEncodeObject;
  date: Date;
};

export const MessageSaveProfileListItem: React.FC<Props> = (props) => {
  const { date } = props;
  const { t } = useTranslation();

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/general.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type save profile')}</Typography.Body1>
        </View>
      )}
    />
  );
};
