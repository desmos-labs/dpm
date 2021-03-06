import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Divider } from '../Divider';
import { LabeledValue } from '../LabeledValue';

export type UnknownTxMessageProps = {
  typeUrl: string;
  value: string;
};

export const UnknownTxMessage: React.FC<UnknownTxMessageProps> = (props) => {
  const { typeUrl, value } = props;
  const { t } = useTranslation();

  return (
    <View>
      <LabeledValue label={t('message type')} value={typeUrl} />
      <Divider />
      <LabeledValue label={t('message value')} value={value} />
    </View>
  );
};
