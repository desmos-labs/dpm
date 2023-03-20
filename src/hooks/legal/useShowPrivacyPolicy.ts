import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useShowPrivacyPolicy = () => {
  const { t } = useTranslation('legal');
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    navigation.navigate(ROUTES.MARKDOWN_TEXT, {
      title: t('privacy policy'),
      fileName: 'privacy.md',
    });
  }, [navigation, t]);
};

export default useShowPrivacyPolicy;
