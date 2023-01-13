import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import VerticalInput from './components/VerticalInput';
import useStyles from './useStyles';

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
        style={styles.message}
        inputStyle={styles.message}
        placeholder={t('give as many details as possible')}
        multiline
        textAlignVertical="top"
      />
    </StyledSafeAreaView>
  );
};

export default Feedback;
