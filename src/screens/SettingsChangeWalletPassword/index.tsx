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
import { setUserPassword } from 'lib/SecureStorage';
import Spacer from 'components/Spacer';
import { useChangeUserPassword } from './hooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS_CHANGE_APPLICATION_PASSWORD
>;

/**
 * Screen that allows the user to change the application password.
 * @constructor
 */
const SettingsChangeWalletPassword = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();

  const { navigation } = props;

  const { loading: changingPassword, changePassword } = useChangeUserPassword();

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [oldPassword, setOldPassword] = useState<string | undefined>(undefined);
  const [oldPasswordError, setOldPasswordError] = useState<string | undefined>(undefined);
  const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // Determines whether the continue button is enabled
  const canContinue = useMemo(
    () => oldPassword && newPassword && !oldPasswordError,
    [newPassword, oldPassword, oldPasswordError],
  );

  // --------------------------------------------------------------------------------------
  // --- Actions
  // --------------------------------------------------------------------------------------

  // Callback that is called when the user changes the old password
  const onOldPasswordChange = useCallback(
    (value: string) => {
      setErrorMessage(undefined);
      setOldPasswordError(undefined);
      setOldPassword(value);
    },
    [setOldPassword],
  );

  // Callback that is called when the user changes the new password
  const onNewPasswordChange = useCallback(
    (value: string) => {
      setErrorMessage(undefined);
      setNewPassword(value);
    },
    [setNewPassword],
  );

  // Callback that is called when the user presses the continue button
  const onContinue = useCallback(async () => {
    const success = await changePassword(oldPassword, newPassword);
    if (!success) {
      setOldPasswordError(t('common:invalid password'));
      return;
    }

    if (!newPassword) {
      return;
    }

    // Set the new password and go back
    const result = await setUserPassword(newPassword);
    if (result.isErr()) {
      setErrorMessage(result.error.message);
    } else {
      navigation.goBack();
    }
  }, [changePassword, navigation, newPassword, oldPassword, t]);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('change password')} />}
      touchableWithoutFeedbackDisabled={false}
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
          />
        </View>
      </View>

      {/* Continue button */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button
          mode="contained"
          onPress={onContinue}
          disabled={!canContinue || changingPassword}
          loading={changingPassword}
        >
          {t('common:confirm')}
        </Button>

        {/* Error message */}
        {errorMessage && (
          <Typography.Body style={styles.errorParagraph}>{{ errorMessage }}</Typography.Body>
        )}
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default SettingsChangeWalletPassword;
