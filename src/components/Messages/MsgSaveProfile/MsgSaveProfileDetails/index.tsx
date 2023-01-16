import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

export type MsgSaveProfileDetailsProps = {
  message: MsgSaveProfileEncodeObject['value'];
};

/**
 * Displays the full details of a MsgSaveProfile
 * @constructor
 */
const MsgSaveProfileDetails = (props: MsgSaveProfileDetailsProps) => {
  const { t } = useTranslation();
  const { message } = props;

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      fields={[
        {
          label: t('dtag'),
          value: message.dtag,
        },
        {
          label: t('nickname'),
          value: message.nickname,
        },
        {
          label: t('bio'),
          value: message.bio,
        },
        {
          label: t('profile picture'),
          value: message.profilePicture,
        },
        {
          label: t('cover picture'),
          value: message.coverPicture,
        },
      ]}
    />
  );
};

export default MsgSaveProfileDetails;
