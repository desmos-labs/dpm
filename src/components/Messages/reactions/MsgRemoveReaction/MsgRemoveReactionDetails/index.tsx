import { MsgRemoveReactionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgRemoveReaction
 * @constructor
 */
const MsgRemoveReactionDetails: MessageDetailsComponent<MsgRemoveReactionEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.reactions');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tPosts } = useTranslation('messages.posts');
  const { t: tCommon } = useTranslation('messages.common');

  const fields = React.useMemo(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: tPosts('post id'),
        value: message.value.postId.toString(),
      },
      {
        label: t('reaction id'),
        value: message.value.reactionId.toString(),
      },
      {
        label: tCommon('user'),
        value: message.value.user,
      },
    ],
    [tSubspaces, message, tPosts, t, tCommon],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('remove reaction')} fields={fields} />
  );
};

export default MsgRemoveReactionDetails;
