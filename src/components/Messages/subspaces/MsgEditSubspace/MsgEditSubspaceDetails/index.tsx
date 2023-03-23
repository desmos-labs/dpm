import { MsgEditSubspaceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

export type MsgEditSubspaceDetailsProps = {
  message: MsgEditSubspaceEncodeObject;
};

/**
 * Displays the full details of a MsgEditSubspace
 * @constructor
 */
const MsgEditSubspaceDetails = (props: MsgEditSubspaceDetailsProps) => {
  const { t } = useTranslation('messages.subspaces');
  const { message } = props;

  const fields = React.useMemo(
    () => [
      {
        label: t('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('name'),
        value: message.value.name,
      },
      {
        label: t('description'),
        value: message.value.description,
      },
      {
        label: t('treasury'),
        value: message.value.treasury,
      },
      {
        label: t('owner'),
        value: message.value.owner,
      },
      {
        label: t('signer'),
        value: message.value.signer,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('edit subspace')} fields={fields} />
  );
};

export default MsgEditSubspaceDetails;
