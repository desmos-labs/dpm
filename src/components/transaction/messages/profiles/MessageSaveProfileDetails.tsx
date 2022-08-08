import { AminoMsgSaveProfile, MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import { MsgSaveProfile } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Divider } from '../../../Divider';
import { LabeledValue } from '../../../LabeledValue';
import { ProfileHeader } from '../../../ProfileHeader';

export type SaveProfileMessageProps = {
  message: MsgSaveProfileEncodeObject['value'];
};

/**
 * Displays the full details of a MsgSaveProfile
 * @constructor
 */
export const MessageSaveProfileDetails: React.FC<SaveProfileMessageProps> = ({message}) => {
  const { t } = useTranslation();

  const profilePicture = useMemo(() => {
    const profilePictureObject = message.profilePicture;
    if (profilePictureObject?.startsWith('http://') || profilePictureObject?.startsWith('https://')) {
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
      <LabeledValue
        label={t('dtag')}
        value={message?.dtag}
      />
      <Divider />
      <LabeledValue
        label={t('nickname')}
        value={message?.nickname}
      />
      <Divider />
      <LabeledValue
        label={t('bio')}
        value={message?.bio}
      />
    </View>
  );
};
