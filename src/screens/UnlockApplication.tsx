import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import { FlexPadding } from '../components/FlexPadding';
import SecureTextInput from '../components/SecureTextInput';
import { Typography } from '../components/typography';
import useKeyboardHeight from '../hooks/useKeyboardHeight';
import useNavigateToHomeScreen from '../hooks/useNavigateToHomeScreen';
import { makeStyle } from '../theming';
import { AccountScreensStackParams, RootStackParams } from '../types/navigation';
import * as SecureStorage from '../utilils/SecureStorage';

export type Props = CompositeScreenProps<
  StackScreenProps<RootStackParams, 'UnlockApplication'>,
  StackScreenProps<AccountScreensStackParams>
>;

const UnlockApplication: React.FC<Props> = (props) => {
  const { route, navigation } = props;
  const oldRoute = route.params?.oldRoute;
  const oldState = route.params?.oldState;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const keyboardHeight = useKeyboardHeight();
  const navigateToHomeScreen = useNavigateToHomeScreen();

  const navigateToCorrectScreen = useCallback(() => {
    if (oldRoute) {
      navigation.reset({
        index: 0,
        routes: oldState.routes,
        key: route.key,
      });
    } else {
      navigateToHomeScreen({});
    }
  }, [navigateToHomeScreen, navigation, oldRoute, oldState, route.key]);

  const unlockWallet = useCallback(async () => {
    setLoading(true);
    try {
      // Get the auth challenge from the device memory
      // if is correct the value should be the user address.
      const value = await SecureStorage.getItem('DPM_GLOBAL_PASSWORD', {
        password,
      });
      if (value === 'DPM_GLOBAL_PASSWORD') {
        navigateToCorrectScreen();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setError(t('invalid password'));
    }
    setLoading(false);
  }, [navigateToCorrectScreen, password, t]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <Typography.Subtitle>{t('enter security password')}</Typography.Subtitle>
      <SecureTextInput
        style={styles.password}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={unlockWallet}
        onTextInput={() => setError(t(''))}
        placeholder={t('password')}
        autoFocus
      />
      <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
      <FlexPadding flex={1} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button mode="contained" onPress={unlockWallet}>
          {t('confirm')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  password: {
    marginTop: theme.spacing.s,
  },
  errorMsg: {
    color: theme.colors.error,
    marginTop: theme.spacing.s,
  },
  forgotPasswordBtn: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    padding: theme.spacing.s,
    marginTop: theme.spacing.s,
  },
}));

export default UnlockApplication;
