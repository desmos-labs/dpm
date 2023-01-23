import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import ListItemSeparator from 'components/ListItemSeparator';
import { HdPath } from '@cosmjs/crypto';
import {
  useFetchWallets,
  useGenerateAccountWithWalletFromHdPath,
} from 'screens/SelectAccount/components/AccountPicker/useHooks';
import { AccountWithWallet } from 'types/account';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import PaginatedFlatList, { ListRenderItemInfo } from '../PaginatedFlatList';
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
  const styles = useStyles();
  const { t } = useTranslation('account');

  const [selectedHdPath, setSelectedHdPath] = useState<HdPath>(params.masterHdPath);
  const [selectedAccount, setSelectedAccount] = useState<AccountWithWallet | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(true);

  const { generateWalletAccountFromHdPath } = useGenerateAccountWithWalletFromHdPath();
  const { fetchWallets } = useFetchWallets(params);

  const allowCoinTypeEdit = useMemo(() => {
    if (params.mode === WalletPickerMode.Mnemonic) {
      return params.allowCoinTypeEdit ?? false;
    }
    return false;
  }, [params]);

  const toggleAddressPicker = useCallback(() => {
    setAddressPickerVisible((visible) => {
      if (!visible) {
        // The address picker is being displayed,
        // remove the wallet generated from the derivation path.
        setSelectedAccount(null);
        setSelectedHdPath(params.masterHdPath);
      } else if (selectedAccount === null) {
        setSelectedHdPath(params.masterHdPath);
        generateWalletAccountFromHdPath(params.masterHdPath, params).then((account) => {
          setSelectedAccount(account);
        });
      }
      return !visible;
    });
  }, [setSelectedAccount, selectedAccount, generateWalletAccountFromHdPath, params]);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<AccountWithWallet>) => {
      const { address } = info.item.account;
      return (
        <AccountListItem
          profile={undefined}
          address={address}
          highlight={selectedAccount?.account.address === address}
          onPress={() => {
            const account = selectedAccount?.account.address === address ? null : info.item;
            setSelectedAccount(account);
            onAccountSelected(account);
          }}
        />
      );
    },
    [selectedAccount, onAccountSelected, setSelectedAccount],
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
        <PaginatedFlatList
          extraData={selectedAccount}
          loadPage={fetchWallets}
          itemsPerPage={10}
          renderItem={renderListItem}
          keyExtractor={listKeyExtractor}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={ListItemSeparator}
          estimatedItemSize={74}
        />
      ) : null}

      <Spacer paddingVertical={4} />

      <Button mode="text" onPress={toggleAddressPicker} labelStyle={styles.pickerOptionButtonLabel}>
        {addressPickerVisible ? t('enter derivation path') : t('select account')}
      </Button>

      <Spacer paddingVertical={4} />

      <View style={{ display: addressPickerVisible ? 'none' : undefined }}>
        {/* Description */}
        <Typography.Body>{t('enter the derivation path you want')}</Typography.Body>

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
            <AccountListItem profile={undefined} address={selectedAccount.account.address} />
          ) : (
            <Typography.Body numberOfLines={1} ellipsizeMode="middle">
              {`${t('generating address')}...`}
            </Typography.Body>
          ))}
      </View>
    </View>
  );
};

export default AccountPicker;
