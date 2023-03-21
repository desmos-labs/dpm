import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import { MsgGrantAllowanceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { View } from 'react-native';
import Typography from 'components/Typography';

type MsgGrantAllowanceListItemPops = MessageListItemComponentProps<MsgGrantAllowanceEncodeObject>;

const MsgGrantAllowanceListItem: React.FC<MsgGrantAllowanceListItemPops> = ({ message, date }) => {
  const { t } = useTranslation('messages.feegrant');
  const { grantee, allowance } = message.value;

  const renderContent = React.useCallback(() => {
    const allowanceType = allowance?.typeUrl?.split('.')?.slice(-1);
    return (
      <View>
        <Typography.Body1>{t('grant allowance')}</Typography.Body1>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('grantee')}: {grantee}
        </Typography.Caption>
        <Typography.Caption>
          {t('allowance')}: {allowanceType}
        </Typography.Caption>
      </View>
    );
  }, [allowance?.typeUrl, grantee, t]);

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgGrantAllowanceListItem;
