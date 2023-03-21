import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import { MsgRevokeAllowanceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { View } from 'react-native';
import Typography from 'components/Typography';

type MsgRevokeAllowanceListItemPops = MessageListItemComponentProps<MsgRevokeAllowanceEncodeObject>;

const MsgRevokeAllowanceListItem: React.FC<MsgRevokeAllowanceListItemPops> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.feegrant');
  const { grantee } = message.value;

  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body1>{t('revoke allowance')}</Typography.Body1>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('grantee')}: {grantee}
        </Typography.Caption>
      </View>
    ),
    [grantee, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgRevokeAllowanceListItem;
