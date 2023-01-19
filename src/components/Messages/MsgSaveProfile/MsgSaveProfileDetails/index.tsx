import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

export type MsgSaveProfileDetailsProps = {
  message: MsgSaveProfileEncodeObject;
};

/**
 * Displays the full details of a MsgSaveProfile
 * @constructor
 */
const MsgSaveProfileDetails = (props: MsgSaveProfileDetailsProps) => {
  const { t } = useTranslation('profile');
  const { message } = props;
  const { value } = message;

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      fields={[
        {
          label: t('dtag'),
          value: value.dtag,
        },
        {
          label: t('nickname'),
          value: value.nickname,
        },
        {
          label: t('bio'),
          value: value.bio,
        },
        {
          label: t('profile picture'),
          value: value.profilePicture,
        },
        {
          label: t('cover picture'),
          value: value.coverPicture,
        },
      ]}
    />
  );
};

export default MsgSaveProfileDetails;
