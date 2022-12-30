import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import IconButton from 'components/IconButton';
import { useAppContext } from '../../../contexts/AppContext';
import { makeStyle } from '../../../theming';
import { Typography } from '../../../components/Typography';

export type AccountBalanceProps = {
  /**
   * Address of the account of interest.
   */
  address: string;
  /**
   * The nickname associated to account.
   */
  nickname?: string;
  /**
   * Callback called when the user press the copy button.
   */
  onCopyPress?: () => void;
  /**
   * Callback called when the user click the send button.
   */
  onSendPressed?: () => void;
  /**
   * Callback called when the user click the hide button.
   */
  onHidePressed?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const AccountBalance: React.FC<AccountBalanceProps> = (props) => {
  const { address, nickname, onCopyPress, onSendPressed, onHidePressed, style } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const { selectedAccountBalance, settings } = useAppContext();

  const hideAmount = (balance: string): string => {
    let toReturn = '';
    for (let index = 0; index < balance.length; index += 1) {
      toReturn += '*';
    }
    return toReturn;
  };

  return (
    <View style={[styles.root, style]}>
      {nickname !== undefined ? (
        <Typography.H4 style={styles.text}>{nickname}</Typography.H4>
      ) : null}
      <View style={styles.addressContainer}>
        <Typography.Body
          style={[styles.address, styles.text]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {address}
        </Typography.Body>
        <IconButton color="#ffffff" icon="content-copy" size={16} onPress={onCopyPress} />
        <IconButton
          color="#ffffff"
          icon={settings.balanceHidden ? 'eye' : 'eye-off'}
          size={16}
          onPress={onHidePressed}
        />
      </View>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceTextContainer}>
          <Typography.Body style={styles.balanceText}>{t('available')}</Typography.Body>
          <Typography.H4 style={styles.balanceText}>
            {settings.balanceHidden
              ? hideAmount(selectedAccountBalance.amount)
              : selectedAccountBalance.amount}{' '}
            {selectedAccountBalance.denom.toUpperCase()}
          </Typography.H4>
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={onSendPressed}>
          <Typography.Body style={styles.sendButtonText}>{t('send')}</Typography.Body>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {},
  text: {
    color: theme.colors.font['5'],
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    width: '60%',
    overflow: 'hidden',
  },
  balanceContainer: {
    borderRadius: theme.roundness,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: theme.spacing.m,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  balanceText: {
    color: theme.dark ? theme.colors.background : theme.colors.text,
  },
  sendButton: {
    height: 54,
    width: 54,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: theme.colors.font['5'],
  },
}));
