import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgSaveProfile
 * @constructor
 */
const MsgSaveProfileDetails: MessageDetailsComponent<MsgSaveProfileEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('profile');
  const { value } = message;

  const fields = React.useMemo(
    () => [
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
    ],
    [t, value],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.profiles"
          i18nKey={toBroadcastMessage ? 'save profile description' : 'saved profile description'}
          components={[<CopiableAddress address={value.creator} />]}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgSaveProfileDetails;
