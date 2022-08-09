import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { StyledSafeAreaView, TopBar, VerticalInput } from '../../components';
import { Typography } from '../../components/Typography';
import { makeStyle } from '../../theming';
import { AccountScreensStackParams } from '../../types/navigation';

type Props = StackScreenProps<AccountScreensStackParams, 'SettingsScreens'>;

/**
 This component is unfinished and not used
 */
const Feedback: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const SubmitButton = (
    <TouchableOpacity>
      <Typography.Subtitle style={styles.submitButton}>{t('submit')}</Typography.Subtitle>
    </TouchableOpacity>
  );

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar
          style={styles.background}
          stackProps={props}
          title={t('Feedback')}
          rightElement={SubmitButton}
        />
      }
    >
      <VerticalInput label={t('email')} placeholder={t('your email address')} />
      <VerticalInput label={t('subject')} placeholder={t('summary of your observation')} />
      <VerticalInput
        label={t('message')}
        style={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        placeholder={t('give as many details as possible')}
        multiline
        textAlignVertical="top"
      />
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    color: theme.colors.primary,
    marginRight: theme.spacing.m,
  },
}));

export default Feedback;
