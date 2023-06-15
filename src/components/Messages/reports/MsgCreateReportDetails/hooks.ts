import { useTranslation } from 'react-i18next';
import React from 'react';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { MessageDetailsField } from 'components/Messages/BaseMessage/BaseMessageDetails';
import { PostTargetTypeUrl, UserTargetTypeUrl } from '@desmoslabs/desmjs';
import { PostTarget, UserTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';

const useGetPostTargetFields = () => {
  const { t } = useTranslation('messages.reports');

  return React.useCallback(
    (reportTarget: PostTarget): MessageDetailsField[] => [
      {
        label: t('reported post id'),
        value: reportTarget.postId.toString(),
      },
    ],
    [t],
  );
};

const useGetUserTargetFields = () => {
  const { t } = useTranslation('messages.reports');

  return React.useCallback(
    (userTarget: UserTarget): MessageDetailsField[] => [
      {
        label: t('reported user'),
        value: userTarget.user,
      },
    ],
    [t],
  );
};

const useGetGenerateReportTargetFields = () => {
  const { t } = useTranslation('messages.reports');
  const getPostTargetFields = useGetPostTargetFields();
  const getUserTargetFields = useGetUserTargetFields();

  return React.useCallback(
    (reportTarget: Any | undefined): MessageDetailsField[] => {
      if (reportTarget === undefined) {
        return [];
      }

      switch (reportTarget.typeUrl) {
        case PostTargetTypeUrl:
          return getPostTargetFields(PostTarget.decode(reportTarget.value));

        case UserTargetTypeUrl:
          return getUserTargetFields(UserTarget.decode(reportTarget.value));

        default:
          return [
            {
              label: t('unknown report target'),
              value: reportTarget.typeUrl,
            },
          ];
      }
    },
    [getPostTargetFields, getUserTargetFields, t],
  );
};

export default useGetGenerateReportTargetFields;
