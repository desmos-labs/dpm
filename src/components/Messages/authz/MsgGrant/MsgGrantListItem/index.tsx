import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgGrantEncodeObject } from '@desmoslabs/desmjs';

const MsgGrantListItem: MessageListItemComponent<MsgGrantEncodeObject> = ({ date, message }) => {
  const { t } = useTranslation('messages.authz');
  const { t: tFeeGrant } = useTranslation('messages.feegrant');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('grant')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {tFeeGrant('grantee')}: {message.value.grantee}
        </Typography.Caption>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('authorization')}: {message.value.grant?.authorization?.typeUrl?.split('.')?.pop()}
        </Typography.Caption>
      </View>
    ),
    [message.value.grant?.authorization?.typeUrl, message.value.grantee, t, tFeeGrant],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgGrantListItem;
