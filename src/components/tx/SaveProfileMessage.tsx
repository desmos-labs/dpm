import { AminoMsgSaveProfile, MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import { MsgSaveProfile } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Divider } from '../Divider';
import { LabeledValue } from '../LabeledValue';
import { ProfileHeader } from '../ProfileHeader';

export type SaveProfileMessageProps = {
  protobufObject?: MsgSaveProfile;
  encodeObject?: MsgSaveProfileEncodeObject['value'];
  aminoMessage?: AminoMsgSaveProfile['value'];
};

export const SaveProfileMessage: React.FC<SaveProfileMessageProps> = ({
  protobufObject,
  encodeObject,
  aminoMessage,
}) => {
  const { t } = useTranslation();

  const profilePicture = useMemo(() => {
    const profilePictureObject =
      protobufObject?.profilePicture ??
      encodeObject?.profilePicture ??
      aminoMessage?.profile_picture;
    if (
      profilePictureObject?.indexOf('http://') === 0 ||
      profilePictureObject?.indexOf('https://') === 0
    ) {
      return profilePictureObject;
    }
    return undefined;
  }, [encodeObject?.profilePicture, protobufObject?.profilePicture, aminoMessage?.profile_picture]);

  const coverPicture = useMemo(() => {
    const coverPictureObject =
      protobufObject?.coverPicture ?? encodeObject?.coverPicture ?? aminoMessage?.cover_picture;

    if (
      coverPictureObject?.indexOf('http://') === 0 ||
      coverPictureObject?.indexOf('https://') === 0
    ) {
      return coverPictureObject;
    }
    return undefined;
  }, [encodeObject?.coverPicture, protobufObject?.coverPicture, aminoMessage?.cover_picture]);

  return (
    <View>
      <ProfileHeader profilePictureUri={profilePicture} coverPictureUri={coverPicture} />
      <LabeledValue
        label={t('dtag')}
        value={protobufObject?.dtag ?? encodeObject?.dtag ?? aminoMessage?.dtag}
      />
      <Divider />
      <LabeledValue
        label={t('nickname')}
        value={protobufObject?.nickname ?? encodeObject?.nickname ?? aminoMessage?.nickname}
      />
      <Divider />
      <LabeledValue
        label={t('bio')}
        value={protobufObject?.bio ?? encodeObject?.bio ?? aminoMessage?.bio}
      />
    </View>
  );
};
