import { convertCoin, MsgDelegateEncodeObject } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: MsgDelegateEncodeObject;
  date: Date;
};

export const MessageDelegateListItem: React.FC<Props> = (props) => {
  const { encodeObject, date } = props;
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const delegateAmount = useMemo(() => {
    if (encodeObject.value.amount) {
      const converted = convertCoin(encodeObject.value.amount, 6, chainInfo.denomUnits);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
    }

    return '0';
  }, [encodeObject.value.amount, chainInfo]);

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/delegate.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('delegate')} {delegateAmount}
          </Typography.Body1>
          <Typography.Caption>
            {t('to')} {encodeObject.value.validatorAddress}
          </Typography.Caption>
        </View>
      )}
    />
  );
};
