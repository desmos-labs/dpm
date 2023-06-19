import { MsgUndelegateEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgWithdrawIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgUndelegate within a list.
 * @constructor
 */
const MsgUndelegateListItem: MessageListItemComponent<MsgUndelegateEncodeObject> = ({
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
          <Typography.Body1>{t('undelegate')}</Typography.Body1>
          <Typography.Caption>
            {t('transaction:from')} {value.validatorAddress}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgUndelegateListItem;
