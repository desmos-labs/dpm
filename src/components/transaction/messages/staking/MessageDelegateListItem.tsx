import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import { convertCoin } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: MsgDelegateEncodeObject["value"];
  date: Date;
};

/**
 * Displays the short details of a MsgDelegate within a list.
 * @constructor
 */
export const MessageDelegateListItem: React.FC<Props> = ({ message, date }) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const delegateAmount = useMemo(() => {
    if (message.amount) {
      const converted = convertCoin(message.amount, 6, chainInfo.denomUnits);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
    }

    return '0';
  }, [message.amount, chainInfo]);

  return (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/delegate.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('delegate')} {delegateAmount}
          </Typography.Body1>
          <View style={{ flexDirection: 'row', flexShrink: 1 }}>
            <Typography.Caption>
              {t('to')} {message.validatorAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};
