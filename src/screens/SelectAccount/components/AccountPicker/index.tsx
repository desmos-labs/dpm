import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import { HdPath } from '@cosmjs/crypto';
import {
  useGenerateAccountWithWalletFromHdPath,
  useGeneratePaginatedWallets,
} from 'screens/SelectAccount/components/AccountPicker/useHooks';
import { AccountWithWallet } from 'types/account';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import { useNavigation } from '@react-navigation/native';
import HdPathPicker from '../HdPathPicker';
import AccountListItem from '../AccountListItem';
import useStyles from './useStyles';
import { AccountPickerParams, WalletPickerMode } from './types';

export type AccountPickerProps = {
  /**
   * Callback called when the user select a wallet.
   * @param wallet
   */
  onAccountSelected: (wallet: AccountWithWallet | null) => void;
  /**
   * Params that tells the component how to generate the addresses that are showed to the
   * user.
   */
  params: AccountPickerParams;
  style?: StyleProp<ViewStyle>;
};

const AccountPicker: React.FC<AccountPickerProps> = ({ onAccountSelected, params, style }) => {
  const { goBack } = useNavigation();
  const styles = useStyles();
  const { t } = useTranslation('account');

  const masterHdPath = useMemo(() => {
    if (params.mode === WalletPickerMode.Mnemonic || params.mode === WalletPickerMode.Ledger) {
      return params.masterHdPath;
    }
    return undefined;
  }, [params]);
  const [toggleAddressPickerDisabled, setToggleAddressPickerDisabled] = useState(true);
  const [selectedHdPath, setSelectedHdPath] = useState<HdPath | undefined>(masterHdPath);
  const [selectedAccount, setSelectedAccount] = useState<AccountWithWallet | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(true);

  const { generateWalletAccountFromHdPath } = useGenerateAccountWithWalletFromHdPath();
  const {
    data: wallets,
    loading: loadingWallets,
    fetchMore,
    error: paginatedWalletsError,
  } = useGeneratePaginatedWallets(params);
  React.useEffect(() => {
    // Disable the possibility to toggle between the hd path input and
    // the list of address.
    setToggleAddressPickerDisabled(loadingWallets);
  }, [loadingWallets]);

  const allowCoinTypeEdit = useMemo(() => {
    if (params.mode === WalletPickerMode.Mnemonic) {
      return params.allowCoinTypeEdit ?? false;
    }
    return false;
  }, [params]);

  const toggleAddressPicker = useCallback(() => {
    if (masterHdPath !== undefined) {
      setAddressPickerVisible((visible) => {
        if (!visible) {
          // The address picker is being displayed,
          // remove the wallet generated from the derivation path.
          setSelectedAccount(null);
          setSelectedHdPath(masterHdPath);
        } else if (selectedAccount === null) {
          setSelectedHdPath(masterHdPath);
          generateWalletAccountFromHdPath(masterHdPath, params).then((account) => {
            setSelectedAccount(account);
          });
        }
        return !visible;
      });
    }
  }, [selectedAccount, masterHdPath, generateWalletAccountFromHdPath, params]);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<AccountWithWallet>) => {
      const { address } = info.item.account;
      return (
        <>
          <AccountListItem
            address={address}
            highlight={selectedAccount?.account.address === address}
            onPress={() => {
              const account = selectedAccount?.account.address === address ? null : info.item;
              setSelectedAccount(account);
              onAccountSelected(account);
            }}
          />
          <Spacer paddingVertical={8} />
        </>
      );
    },
    [selectedAccount?.account.address, onAccountSelected],
  );

  const listKeyExtractor = useCallback((item: AccountWithWallet) => item.account.address, []);

  const onHdPathChange = useCallback(
    async (hdPath: HdPath) => {
      setSelectedAccount(null);
      setSelectedHdPath(hdPath);
      const wallet = await generateWalletAccountFromHdPath(hdPath, params);
      setSelectedAccount(wallet);
      onAccountSelected(wallet);
    },
    [generateWalletAccountFromHdPath, params, onAccountSelected],
  );

  return (
    <View style={[style, styles.root]}>
      {/* Address picker */}
      {addressPickerVisible ? (
        <FlashList
          data={paginatedWalletsError ? [] : wallets}
          extraData={selectedAccount}
          renderItem={renderListItem}
          keyExtractor={listKeyExtractor}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.2}
          estimatedItemSize={89}
          ListFooterComponent={
            <StyledActivityIndicator animating={loadingWallets} hidesWhenStopped size="small" />
          }
          ListEmptyComponent={
            paginatedWalletsError ? (
              <EmptyList
                image={DPMImages.NoData}
                message={paginatedWalletsError?.message}
                extraComponent={
                  <Button onPress={goBack} mode="contained">
                    {t('common:go back')}
                  </Button>
                }
              />
            ) : undefined
          }
        />
      ) : (
        <View style={styles.hdPathPickerView}>
          {/* Description */}
          <Typography.Regular16>{t('enter the derivation path you want')}</Typography.Regular16>

          {/* Path picker */}
          <HdPathPicker
            style={styles.hdPathPicker}
            onChange={onHdPathChange}
            value={selectedHdPath}
            disabled={!selectedAccount || addressPickerVisible}
            allowCoinTypeEdit={allowCoinTypeEdit}
          />

          <Spacer paddingVertical={8} />

          {/* Last generated address */}
          {!addressPickerVisible &&
            (selectedAccount?.account.address ? (
              <AccountListItem address={selectedAccount.account.address} fetchDelay={0} />
            ) : (
              <Typography.Body numberOfLines={1} ellipsizeMode="middle">
                {`${t('generating address')}...`}
              </Typography.Body>
            ))}
        </View>
      )}

      {masterHdPath !== undefined && (
        <Button
          disabled={toggleAddressPickerDisabled}
          mode="text"
          onPress={toggleAddressPicker}
          labelStyle={styles.pickerOptionButtonLabel}
        >
          {addressPickerVisible ? t('enter derivation path') : t('select account')}
        </Button>
      )}
    </View>
  );
};

export default AccountPicker;
