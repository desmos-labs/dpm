import React, { useMemo } from 'react';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';
import { convertCoin } from '@desmoslabs/desmjs';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgDelegateIcon } from 'assets/images';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import useStyles from './useStyles';

/**
 * Displays the short details of a MsgDelegate within a list.
 * @constructor
 */
const MsgDelegateListItem: MessageListItemComponent<MsgDelegateEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.staking');
  const chainInfo = useCurrentChainInfo();
  const styles = useStyles();
  const { value } = message;

  const delegateAmount = useMemo(() => {
    if (value.amount) {
      const converted = convertCoin(value.amount, 6, chainInfo.currencies);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
    }

    return '0';
  }, [value.amount, chainInfo]);

  return (
    <BaseMessageListItem
      icon={msgDelegateIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('delegate')} {delegateAmount}
          </Typography.Body1>
          <View style={styles.validatorAddress}>
            <Typography.Caption>
              {t('transaction:to')} {value.validatorAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgDelegateListItem;
