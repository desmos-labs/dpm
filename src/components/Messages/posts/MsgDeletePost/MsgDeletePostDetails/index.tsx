import { MsgDeletePostEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgDeletePost
 * @constructor
 */
const MsgDeletePostDetails: MessageDetailsComponent<MsgDeletePostEncodeObject> = ({ message }) => {
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
        label: tCommon('signer'),
        value: message.value.signer,
      },
    ],
    [tSubspaces, tCommon, t, message],
  );

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgDeletePostDetails;
