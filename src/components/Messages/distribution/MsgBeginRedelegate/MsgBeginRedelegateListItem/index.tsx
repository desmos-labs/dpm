import { MsgBeginRedelegateEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgWithdrawIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgBeginRedelegate within a list.
 * @constructor
 */
const MsgBeginRedelegateListItem: MessageListItemComponent<MsgBeginRedelegateEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.staking');
  const { value } = message;

  return (
    <BaseMessageListItem
      icon={msgWithdrawIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('redelegate')}</Typography.Body1>
          <Typography.Caption>
            {t('transaction:from')} {value.validatorSrcAddress}
          </Typography.Caption>
          <Typography.Caption>
            {t('transaction:to')} {value.validatorDstAddress}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgBeginRedelegateListItem;
