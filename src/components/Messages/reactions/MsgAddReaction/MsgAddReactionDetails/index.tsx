import { MsgAddReactionEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useGetReactionValueFields from 'components/Messages/reactions/MsgAddReaction/MsgAddReactionDetails/hooks';

/**
 * Displays the full details of a MsgAddReaction
 * @constructor
 */
const MsgAddReactionDetails: MessageDetailsComponent<MsgAddReactionEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.reactions');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tPosts } = useTranslation('messages.posts');
  const { t: tCommon } = useTranslation('messages.common');
  const getReactionValueFields = useGetReactionValueFields();

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
      ...getReactionValueFields(message.value.value),
      {
        label: tCommon('user'),
        value: message.value.user,
      },
    ],
    [tSubspaces, message, tPosts, getReactionValueFields, tCommon],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('add reaction')} fields={fields} />
  );
};

export default MsgAddReactionDetails;
