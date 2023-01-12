import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import { checkUserPassword, setUserPassword } from 'lib/SecureStorage';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS_CHANGE_APPLICATION_PASSWORD
>;

const SettingsChangeWalletPassword = (props: NavProps) => {
  const { navigation } = props;
  const { t } = useTranslation('settings');
  const styles = useStyles();

  const [oldPassword, setOldPassword] = useState<string | undefined>(undefined);
  const [oldPasswordError, setOldPasswordError] = useState<string | undefined>(undefined);
  const onOldPasswordChange = useCallback(
    (value: string) => {
      setOldPassword(value);
      setOldPasswordError(undefined);
    },
    [setOldPassword],
  );

  const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
  const onNewPasswordChange = useCallback(
    (value: string) => setNewPassword(value),
    [setNewPassword],
  );

  const canContinue = useMemo(
    () => oldPassword && newPassword && !oldPasswordError,
    [newPassword, oldPassword, oldPasswordError],
  );

  const onContinue = useCallback(async () => {
    const isOldPasswordValid = await checkUserPassword(oldPassword || '');
    if (!isOldPasswordValid) {
      setOldPasswordError(t('common:invalid password'));
      return;
    }

    if (!newPassword) {
      return;
    }

    // Set the new password and go back
    await setUserPassword(newPassword);
    navigation.goBack();
  }, [navigation, newPassword, oldPassword, t]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('change password')} />}
    >
      {/* Description */}
      <Typography.Body>{t('change application password description')}</Typography.Body>

      <Spacer paddingVertical={8} />

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <View>
          {/* Old password input */}
          <Typography.Body>{t('enter your old password')}</Typography.Body>
          <SecureTextInput
            placeholder={t('common:password')}
            style={styles.password}
            value={oldPassword}
            onChangeText={onOldPasswordChange}
            error={oldPasswordError !== undefined}
            autoFocus
          />
          <Typography.Body style={styles.errorParagraph}>{oldPasswordError}</Typography.Body>
        </View>

        <Spacer paddingVertical={8} />

        <View>
          {/* New password input */}
          <Typography.Body>{t('enter your new password')}</Typography.Body>
          <SecureTextInput
            placeholder={t('common:password')}
            style={styles.password}
            value={newPassword}
            onChangeText={onNewPasswordChange}
            onSubmitEditing={onContinue}
            autoFocus
          />
          <Typography.Body style={styles.errorParagraph}>{/* {errorMessage} */}</Typography.Body>
        </View>
      </View>

      {/* Continue button */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button mode="contained" onPress={onContinue} disabled={!canContinue}>
          {t('common:confirm')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default SettingsChangeWalletPassword;
