import { useSetSetting, useSetting } from '@recoil/settings';
import useShowModal from 'hooks/useShowModal';
import React from 'react';
import TwoButtonModal from 'modals/TwoButtonModal';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

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

/**
 * Hook that provides a function to enable or disable the
 * prompt for unlocking the application and the current status.
 */
export const useToggleAppLock = () => {
  const { t } = useTranslation('settings');
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const appLockEnabled = useSetting('autoAppLock');
  const setAppLockEnabled = useSetSetting('autoAppLock');

  const toggleAppLock = React.useCallback(() => {
    navigation.navigate(ROUTES.SETTINGS_SWITCH_SCREEN, {
      title: t('disable app lock'),
      description: t('disable app lock message'),
      intialValue: !appLockEnabled,
      toggleSetting: () => {
        setAppLockEnabled((currentValue) => !currentValue);
      },
    });
  }, [appLockEnabled, navigation, setAppLockEnabled, t]);

  return toggleAppLock;
};
