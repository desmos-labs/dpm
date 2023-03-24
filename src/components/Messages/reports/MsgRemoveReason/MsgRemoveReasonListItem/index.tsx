import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { MsgRemoveReasonEncodeObject } from '@desmoslabs/desmjs';

/**
 * Displays the short details of a MsgRemoveReason within a list.
 * @constructor
 */
const MsgRemoveReasonListItem: MessageListItemComponent<MsgRemoveReasonEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.reports');
  const { t: tSubspaces } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('remove reason')} {message.value.reasonId.toString()}
          </Typography.Body1>
          <Typography.Caption>
            {tSubspaces('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgRemoveReasonListItem;
