import { MsgAnswerPollEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgAnswerPoll
 * @constructor
 */
const MsgEditSubspaceDetails: MessageDetailsComponent<MsgAnswerPollEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const { t: tCommon } = useTranslation('messages.common');

  const fields = React.useMemo(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('post id'),
        value: message.value.postId.toString(),
      },
      {
        label: t('poll id'),
        value: message.value.pollId.toString(),
      },
      {
        label: t('answers indexes'),
        value: message.value.answersIndexes.join('\n'),
      },
      {
        label: tCommon('signer'),
        value: message.value.signer,
      },
    ],
    [tSubspaces, message, t, tCommon],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('answer poll')} fields={fields} />
  );
};

export default MsgEditSubspaceDetails;
