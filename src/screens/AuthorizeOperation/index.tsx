import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import BiometricsLoadingIndicator from 'components/BiometricsLoadingIndicator';
import Padding from 'components/Flexible/Padding';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import { AccountScreensStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import useStyles from './useStyles';

type Props = StackScreenProps<AccountScreensStackParams, 'AuthorizeOperation'>;

const AuthorizeOperation: React.FC<Props> = (props) => {
  const { navigation, route } = props;
  const { resolve } = route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [loadingBiometrics] = useState(false);
  const [error] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK') {
          resolve({
            authorized: false,
            wallet: null,
          });
        }
      }),
    [navigation, resolve],
  );

  return (
    <View style={styles.root}>
      {loadingBiometrics && <BiometricsLoadingIndicator />}
      <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('wallet password')} />}>
        <Typography.Subtitle>{t('enter wallet password')}</Typography.Subtitle>
        <SecureTextInput
          style={styles.password}
          value={password}
          onChangeText={setPassword}
          placeholder={t('password')}
          autoFocus
        />
        <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
        <Padding flex={1} />
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        >
          <Button mode="contained" loading={loading} disabled={loading}>
            {loading ? t('unlocking') : t('confirm')}
          </Button>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </View>
  );
};

export default AuthorizeOperation;
