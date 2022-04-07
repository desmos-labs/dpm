import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings as SettingsComponents,
  StyledSafeAreaView,
  TopBar,
  Button,
} from '../../components';
import { makeStyle } from '../../theming';
import { AccountCreationStackParams, RootStackParams } from '../../types/navigation';
import { Typography } from '../../components/typography';
import { FlexPadding } from '../../components/FlexPadding';

type Props = CompositeScreenProps<
  StackScreenProps<AccountCreationStackParams, 'Legal'>,
  StackScreenProps<RootStackParams>
>;

const Legal: React.FC<Props> = (props) => {
  const {
    navigation,
    route: {
      params: { mode },
    },
  } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const openTermsOfService = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('Terms of Service'),
        asset: 'terms-of-service.md',
      },
    });
  }, [navigation, t]);

  const openPrivacyPolicy = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('Privacy Policy'),
        asset: '',
      },
    });
  }, [navigation, t]);

  const onAccepted = useCallback(() => {
    if (mode === 'create') {
      navigation.navigate({
        name: 'GenerateNewMnemonic',
        params: undefined,
      });
    } else {
      navigation.navigate({
        name: 'ImportRecoveryPassphrase',
        params: undefined,
      });
    }
  }, [navigation, mode]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} />}
    >
      <Typography.Title style={styles.title}>{t('legal')}</Typography.Title>

      <Typography.Body>
        {t('please review the desmos profile manager terms of service and privacy policy')}.
      </Typography.Body>
      <SettingsComponents.SettingsSection style={styles.section}>
        <SettingsComponents.SettingsButton
          label={t('terms of service')}
          onPress={openTermsOfService}
        />
        <SettingsComponents.SettingsButton
          label={t('privacy policy')}
          onPress={openPrivacyPolicy}
        />
      </SettingsComponents.SettingsSection>
      <FlexPadding flex={1} />
      <Button onPress={onAccepted} mode="contained">
        {t('accept')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  title: {
    marginBottom: theme.spacing.s,
  },
  section: {
    marginTop: theme.spacing.l,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.line,
  },
}));

export default Legal;
