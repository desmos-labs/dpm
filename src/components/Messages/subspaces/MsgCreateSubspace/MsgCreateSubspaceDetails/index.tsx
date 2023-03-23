import { MsgCreateSubspaceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

export type MsgCreateSubspaceDetailsProps = {
  message: MsgCreateSubspaceEncodeObject;
};

/**
 * Displays the full details of a MsgCreateSubspace
 * @constructor
 */
const MsgCreateSubspaceDetails = (props: MsgCreateSubspaceDetailsProps) => {
  const { t } = useTranslation('messages.subspaces');
  const { message } = props;

  const fields = React.useMemo(
    () => [
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
        label: t('creator'),
        value: message.value.creator,
      },
      {
        label: t('owner'),
        value: message.value.owner,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('create subspace')} fields={fields} />
  );
};

export default MsgCreateSubspaceDetails;
