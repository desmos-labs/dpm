import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Wallet, WalletType } from 'types/wallet';
import Typography from 'components/Typography';
import AddressListItem from 'components/AddressListItem';
import HdPathPicker from 'components/HdPathPicker';
import Divider from 'components/Divider';
import PaginatedFlatList from 'components/PaginatedFlatList';
import ListItemSeparator from 'components/ListItemSeparator';
import { HdPath } from '@cosmjs/crypto';
import {
  useFetchWallets,
  useGenerateAccountWithWalletFromHdPath,
} from 'screens/SelectAccount/components/AccountPicker/useHooks';
import { slip10IndexToBaseNumber } from 'lib/FormatUtils';
import { AccountWithWallet } from 'types/account';
import useStyles from './useStyles';
import { AccountPickerParams, WalletPickerMode } from './types';

export type AccountPickerProps = {
  /**
   * Callback called when the component is generating the addresses
   * or the component have correctly generated all the addresses
   * @param loading - true means that the component is generating the addresses, false
   * means that the component is not generating the addresses.
   */
  onGeneratingAddressesStateChange: (loading: boolean) => void;
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

const AccountPicker: React.FC<AccountPickerProps> = ({
  onGeneratingAddressesStateChange,
  onAccountSelected,
  params,
  style,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [selectedHdPath, setSelectedHdPath] = useState<HdPath>(params.masterHdPath);
  const [selectedAccount, setSelectedAccount] = useState<AccountWithWallet | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(false);
  const [generatingAddresses] = useState(false);
  const { generateWalletAccountFromHdPath } = useGenerateAccountWithWalletFromHdPath();
  const { fetchWallets } = useFetchWallets(params);
  const allowCoinTypeEdit = useMemo(() => {
    if (params.mode === WalletPickerMode.Mnemonic) {
      return params.allowCoinTypeEdit ?? false;
    }
    return false;
  }, [params]);

  useEffect(() => {
    onAccountSelected(selectedAccount);
  }, [selectedAccount, onAccountSelected]);

  useEffect(() => {
    onGeneratingAddressesStateChange(generatingAddresses);
  }, [generatingAddresses, onGeneratingAddressesStateChange]);

  useEffect(() => {
    (async () => {
      const account = await generateWalletAccountFromHdPath(selectedHdPath, params);
      setSelectedAccount(account);
    })();
  }, []);

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
      let number;
      switch (info.item.wallet.type) {
        case WalletType.Mnemonic:
        case WalletType.Ledger:
          number = slip10IndexToBaseNumber(info.item.wallet.hdPath[2]);
          break;
        default:
          number = 0;
          break;
      }
      return (
        <AddressListItem
          number={number}
          address={address}
          highlight={selectedAccount?.account.address === address}
          onPress={() => {
            const account = selectedAccount?.account.address === address ? null : info.item;
            setSelectedAccount(account);
            return account;
          }}
        />
      );
    },
    [selectedAccount, setSelectedAccount],
  );

  const listKeyExtractor = useCallback((item: Wallet) => item.address, []);

  const debouncedGenerateWallet = useCallback(
    debounce(async (hdPath: HdPath) => {
      const wallet = await generateWalletAccountFromHdPath(hdPath, params);
      setSelectedAccount(wallet);
    }, 2000),
    [generateWalletAccountFromHdPath, params],
  );

  const onHdPathChange = useCallback(
    (hdPath: HdPath) => {
      setSelectedAccount(null);
      setSelectedHdPath(hdPath);
      debouncedGenerateWallet(hdPath);
    },
    [debouncedGenerateWallet, setSelectedAccount],
  );

  return (
    <View style={[style, styles.root]}>
      <Typography.Subtitle
        style={[styles.hpPathLabel, addressPickerVisible ? styles.disabledText : null]}
      >
        {t('enter derivation path')}.
      </Typography.Subtitle>
      <HdPathPicker
        style={styles.hdPathPicker}
        onChange={onHdPathChange}
        value={selectedHdPath}
        disabled={addressPickerVisible}
        allowCoinTypeEdit={allowCoinTypeEdit}
      />

      {!addressPickerVisible && (
        <Typography.Body style={styles.addressText}>
          {selectedAccount ? selectedAccount.account.address : `${t('generating address')}...`}
        </Typography.Body>
      )}

      <View style={styles.dividerContainer}>
        <Divider style={styles.dividerLine} />
        <Typography.Subtitle style={styles.dividerText}>{t('or')}</Typography.Subtitle>
        <Divider style={styles.dividerLine} />
      </View>

      <TouchableOpacity onPress={toggleAddressPicker} disabled={generatingAddresses}>
        <Typography.Subtitle
          style={[
            styles.toggleSelectAccount,
            !addressPickerVisible ? styles.toggleSelectAccountEnabled : null,
          ]}
        >
          {t('select account')}
        </Typography.Subtitle>
      </TouchableOpacity>

      {addressPickerVisible ? (
        <PaginatedFlatList
          style={styles.addressesList}
          loadPage={fetchWallets}
          itemsPerPage={10}
          renderItem={renderListItem}
          keyExtractor={listKeyExtractor}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={ListItemSeparator}
        />
      ) : null}
    </View>
  );
};

export default AccountPicker;
