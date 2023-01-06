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
import useAccountBalance from 'hooks/useAccountBalance';
import { ActivityIndicator } from 'react-native-paper';
import useStyles from './useStyles';

export type AccountBalanceProps = {
  account: Account;
  profile: DesmosProfile | undefined;
  style?: StyleProp<ViewStyle>;
};

const AccountBalance: React.FC<AccountBalanceProps> = (props) => {
  const { account, profile, style } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [settings, setSettings] = useSettingsState();

  const nickname = useMemo(() => profile?.nickname, [profile]);
  const address = useMemo(() => profile?.address || account.address, [account, profile]);

  const { balance, loading } = useAccountBalance(address);
  const balanceValue = useMemo(() => {
    const value = formatCoins(balance);
    return settings.balanceHidden ? formatHiddenValue(value) : value;
  }, [settings, balance]);

  const onHidePressed = useCallback(() => {
    setSettings({
      ...settings,
      balanceHidden: !settings.balanceHidden,
    });
  }, [settings]);

  const onSendPressed = useCallback(() => {
    console.log('AccountBalance - implement onSend');
  }, []);

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
