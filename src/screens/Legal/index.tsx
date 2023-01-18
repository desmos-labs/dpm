import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Padding from 'components/Flexible/Padding';
import Flexible from 'components/Flexible';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LEGAL>;

export interface LegalParams {
  next: ROUTES;
}

const Legal = (props: NavProps) => {
  const { t } = useTranslation('legal');
  const styles = useStyles();

  const { navigation, route } = props;
  const { next } = route.params;

  const openTermsOfService = useCallback(async () => {
    navigation.navigate(ROUTES.MARKDOWN_TEXT, {
      title: t('terms of service'),
      fileName: 'terms-of-service.md',
    });
  }, [navigation, t]);

  const openPrivacyPolicy = useCallback(async () => {
    navigation.navigate(ROUTES.MARKDOWN_TEXT, {
      title: t('privacy policy'),
      fileName: 'privacy.md',
    });
  }, [navigation, t]);

  const onAccepted = useCallback(() => {
    navigation.navigate<any>(next);
  }, [navigation, next]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} />}
    >
      <Typography.Title style={styles.title}>{t('legal')}</Typography.Title>

      <Typography.Body>
        {t('please review the desmos profile manager terms of service and privacy policy')}.
      </Typography.Body>
      <Flexible.Section style={styles.section}>
        <Flexible.SectionButton label={t('terms of service')} onPress={openTermsOfService} />
        <Flexible.SectionButton label={t('privacy policy')} onPress={openPrivacyPolicy} />
      </Flexible.Section>
      <Padding flex={1} />
      <Button onPress={onAccepted} mode="contained">
        {t('accept')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default Legal;
