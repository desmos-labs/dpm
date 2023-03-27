import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgRevokeEncodeObject } from '@desmoslabs/desmjs';

type MsgRevokeListItemProps = MessageListItemComponentProps<MsgRevokeEncodeObject>;

const MsgRevokeListItem: React.FC<MsgRevokeListItemProps> = ({ date, message }) => {
  const { t } = useTranslation('messages.authz');
  const { t: tFeeGrant } = useTranslation('messages.feegrant');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('revoke grant')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {tFeeGrant('grantee')}: {message.value.grantee}
        </Typography.Caption>
        {message.value.msgTypeUrl !== undefined && (
          <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
            {t('authorization')}: {message.value.msgTypeUrl?.split('.').pop()}
          </Typography.Caption>
        )}
      </View>
    ),
    [message.value.grantee, message.value.msgTypeUrl, t, tFeeGrant],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgRevokeListItem;
