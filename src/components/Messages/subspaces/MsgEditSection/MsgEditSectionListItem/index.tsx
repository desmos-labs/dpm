import { MsgEditSectionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgEditSection within a list.
 * @constructor
 */
const MsgEditSectionListItem: MessageListItemComponent<MsgEditSectionEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('edit section')}</Typography.Body1>
          <Typography.Caption>
            {t('section id')}: {message.value.sectionId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgEditSectionListItem;
