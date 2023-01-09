import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Divider from 'components/Divider';
import LabeledValue from 'components/LabeledValue';
import ProfileHeader from 'components/ProfileHeader';
import Typography from 'components/Typography';
import { msgGeneralIcon } from 'assets/images';
import BaseMessage from '../BaseMessage';

export type DetailsProps = {
  message: MsgSaveProfileEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgSaveProfileEncodeObject['value'];
  date: Date;
};

namespace MsgSaveProfile {
  /**
   * Displays the short details of a MsgSaveProfile within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ date }) => {
    const { t } = useTranslation();
    return (
      <BaseMessage.ListItem
        icon={msgGeneralIcon}
        date={date}
        renderContent={() => (
          <View>
            <Typography.Body1>{t('tx type save profile')}</Typography.Body1>
          </View>
        )}
      />
    );
  };

  /**
   * Displays the full details of a MsgSaveProfile
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({ message }) => {
    const { t } = useTranslation();

    const profilePicture = useMemo(() => {
      const profilePictureObject = message.profilePicture;
      if (
        profilePictureObject?.startsWith('http://') ||
        profilePictureObject?.startsWith('https://')
      ) {
        return profilePictureObject;
      }
      return undefined;
    }, [message.profilePicture]);

    const coverPicture = useMemo(() => {
      const coverPictureObject = message.coverPicture;
      if (coverPictureObject?.startsWith('http://') || coverPictureObject?.startsWith('https://')) {
        return coverPictureObject;
      }
      return undefined;
    }, [message?.coverPicture]);

    return (
      <View>
        <ProfileHeader profilePictureUri={profilePicture} coverPictureUri={coverPicture} />
        <LabeledValue label={t('dtag')} value={message?.dtag} />
        <Divider />
        <LabeledValue label={t('nickname')} value={message?.nickname} />
        <Divider />
        <LabeledValue label={t('bio')} value={message?.bio} />
      </View>
    );
  };
}

export default MsgSaveProfile;
