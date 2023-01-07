import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import { useSettingsState } from '@recoil/settings';
import CopyButton from 'components/CopyButton';
import { Account } from 'types/account';
import { DesmosProfile } from 'types/desmosTypes';
import { formatCoins, formatHiddenValue } from 'lib/FormatUtils';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { Coin } from '@cosmjs/amino';
import useStyles from './useStyles';

export type AccountBalanceProps = {
  account: Account;
  profile: DesmosProfile | undefined;
  balance: Coin[];
  loading: boolean;
  style?: StyleProp<ViewStyle>;
};

const AccountBalance: React.FC<AccountBalanceProps> = (props) => {
  const { account, profile, balance, loading, style } = props;
  const { t } = useTranslation('common');
  const styles = useStyles();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const [settings, setSettings] = useSettingsState();

  const nickname = profile?.nickname;
  const address = profile?.address || account.address;

  const balanceValue = useMemo(() => {
    const value = formatCoins(balance);
    return settings.balanceHidden ? formatHiddenValue(value) : value;
  }, [settings, balance]);

  const onHidePressed = useCallback(() => {
    setSettings({
      ...settings,
      balanceHidden: !settings.balanceHidden,
    });
  }, [setSettings, settings]);

  const onSendPressed = useCallback(() => {
    navigation.navigate(ROUTES.SEND_TOKENS);
  }, [navigation]);

  return (
    <View style={[styles.root, style]}>
      {/* Nickname */}
      {nickname && <Typography.H4 style={styles.text}>{nickname}</Typography.H4>}

      {/* Address data */}
      <View style={styles.addressContainer}>
        <Typography.Body
          style={[styles.address, styles.text]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {address}
        </Typography.Body>
        <CopyButton value={address} />
        <IconButton
          color="#ffffff"
          icon={settings.balanceHidden ? 'eye' : 'eye-off'}
          size={16}
          onPress={onHidePressed}
        />
      </View>

      {/* Balance data */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceTextContainer}>
          <Typography.Body style={styles.balanceText}>{t('available')}</Typography.Body>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Typography.H4 style={styles.balanceText}>{balanceValue}</Typography.H4>
          )}
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={onSendPressed}>
          <Typography.Body style={styles.sendButtonText}>{t('send')}</Typography.Body>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountBalance;
