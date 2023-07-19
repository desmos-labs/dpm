import { useSetSetting, useSetting } from '@recoil/settings';
import useShowModal from 'hooks/useShowModal';
import React from 'react';
import TwoButtonModal from 'modals/TwoButtonModal';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';

/**
 * Hooks that provides a function to enable or disable the analytics
 * and the current analytics status.
 */
export const useToggleAnalytics = () => {
  const { t } = useTranslation('settings');
  const postHog = usePostHog();
  const analyticsEnabled = useSetting('analyticsEnabled');
  const setAnalyticsEnabled = useSetSetting('analyticsEnabled');
  const showModal = useShowModal();

  const toggleAnalytics = React.useCallback(() => {
    if (analyticsEnabled) {
      postHog?.optOut();
      setAnalyticsEnabled(false);
    } else {
      showModal(TwoButtonModal, {
        title: t('enable analytics'),
        message: t('enable analytics message'),
        positiveActionLabel: t('common:yes'),
        positiveAction: () => {
          postHog?.optIn();
          setAnalyticsEnabled(true);
        },
        negativeActionLabel: t('common:no'),
      });
    }
  }, [analyticsEnabled, postHog, setAnalyticsEnabled, showModal, t]);

  return { analyticsEnabled, toggleAnalytics };
};
