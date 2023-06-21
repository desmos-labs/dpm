import {
  MsgCreateReportEncodeObject,
  PostTargetTypeUrl,
  UserTargetTypeUrl,
} from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { PostTarget, UserTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';

/**
 * Displays the full details of a MsgCreateReport
 * @constructor
 */
const MsgCreateReportDetails: MessageDetailsComponent<MsgCreateReportEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.reports');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: t('reasons ids'),
        value: message.value.reasonsIds.toString(),
      },
      {
        label: t('message'),
        value: message.value.message,
        hide: message.value.message.length === 0,
      },
    ],
    [t, message],
  );

  const reportMessage = React.useMemo(() => {
    if (message.value.target?.typeUrl === PostTargetTypeUrl) {
      const postTarget = PostTarget.decode(message.value.target.value);
      return (
        <Trans
          ns="messages.reports"
          i18nKey={
            toBroadcastMessage
              ? 'create post report description'
              : 'created post report description'
          }
          components={[
            <CopiableAddress address={message.value.reporter} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            postId: postTarget.postId,
          }}
        />
      );
    }
    if (message.value.target?.typeUrl === UserTargetTypeUrl) {
      const userTarget = UserTarget.decode(message.value.target.value);
      return (
        <Trans
          ns="messages.reports"
          i18nKey={
            toBroadcastMessage
              ? 'create user report description'
              : 'created user report description'
          }
          components={[
            <CopiableAddress address={message.value.reporter} />,
            <CopiableAddress address={userTarget.user} />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
          }}
        />
      );
    }
    return undefined;
  }, [message.value]);

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>{reportMessage}</Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgCreateReportDetails;
