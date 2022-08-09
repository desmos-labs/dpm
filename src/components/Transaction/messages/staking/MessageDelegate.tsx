import { convertCoin } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {View} from "react-native";
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import {BaseMessage} from '../base/BaseMessage';
import {Typography} from "../../../typography";

export type DetailsProps = {
  message: MsgDelegateEncodeObject["value"];
};

export type ListItemProps = {
  message: MsgDelegateEncodeObject["value"];
  date: Date;
};

export namespace MessageDelegate {
  /**
   * Displays the short details of a MsgDelegate within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
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
      <BaseMessage.ListItem
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

  /**
   * Displays the full details of a MsgDelegate
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({message}) => {
    const { t } = useTranslation();
    const chainInfo = useCurrentChainInfo();

    const amount = useMemo(() => {
      const totalAmount = message?.amount;
      if (totalAmount !== undefined) {
        const converted = convertCoin(totalAmount, 6, chainInfo.denomUnits);
        if (converted !== null) {
          return `${converted.amount} ${converted.denom.toUpperCase()}`;
        }
        return '';
      }
      return '';
    }, [message?.amount, chainInfo.denomUnits]);

    return (
      <BaseMessage.Details
        icon={require('../../../../assets/tx-icons/delegate.png')}
        iconSubtitle={`${t('delegate')} ${amount}`}
        fields={[
          {
            label: t('amount'),
            value: amount,
          },
          {
            label: t('from'),
            value: message?.delegatorAddress ?? '',
          },
          {
            label: t('to'),
            value: message?.validatorAddress ?? '',
          },
        ]}
      />
    );
  };
}


