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
  useGenerateWalletFromHdPath,
} from 'screens/SelectAddress/components/WalletPicker/useHooks';
import { slip10IndexToBaseNumber } from 'lib/FormatUtils';
import useStyles from './useStyles';
import { WalletPickerMode, WalletPickerParams } from './types';

export type WalletPickerProps = {
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
  onWalletSelected: (wallet: Wallet | null) => void;
  /**
   * Params that tells the component how to generate the addresses that are showed to the
   * user.
   */
  params: WalletPickerParams;
  style?: StyleProp<ViewStyle>;
};

const WalletPicker: React.FC<WalletPickerProps> = ({
  onGeneratingAddressesStateChange,
  onWalletSelected,
  params,
  style,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [selectedHdPath, setSelectedHdPath] = useState<HdPath>(params.masterHdPath);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(false);
  const [generatingAddresses] = useState(false);
  const { generateWalletFromHdPath } = useGenerateWalletFromHdPath();
  const { fetchWallets } = useFetchWallets(params);
  const allowCoinTypeEdit = useMemo(() => {
    if (params.mode === WalletPickerMode.Mnemonic) {
      return params.allowCoinTypeEdit ?? false;
    }
    return false;
  }, [params]);

  useEffect(() => {
    onWalletSelected(selectedWallet);
  }, [selectedWallet, onWalletSelected]);

  useEffect(() => {
    onGeneratingAddressesStateChange(generatingAddresses);
  }, [generatingAddresses, onGeneratingAddressesStateChange]);

  useEffect(() => {
    (async () => {
      const wallet = await generateWalletFromHdPath(selectedHdPath, params);
      setSelectedWallet(wallet);
    })();
  }, []);

  const toggleAddressPicker = useCallback(() => {
    setAddressPickerVisible((visible) => {
      if (!visible) {
        // The address picker is being displayed,
        // remove the wallet generated from the derivation path.
        setSelectedWallet(null);
        setSelectedHdPath(params.masterHdPath);
      } else if (selectedWallet === null) {
        setSelectedHdPath(params.masterHdPath);
        generateWalletFromHdPath(params.masterHdPath, params).then((wallet) => {
          setSelectedWallet(wallet);
        });
      }
      return !visible;
    });
  }, [setSelectedWallet, selectedWallet, generateWalletFromHdPath, params]);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<Wallet>) => {
      const { address } = info.item;
      let number;
      switch (info.item.type) {
        case WalletType.Mnemonic:
        case WalletType.Ledger:
          number = slip10IndexToBaseNumber(info.item.hdPath[2]);
          break;
        default:
          number = 0;
          break;
      }
      return (
        <AddressListItem
          number={number}
          address={address}
          highlight={selectedWallet?.address === address}
          onPress={() => {
            const wallet = selectedWallet?.address === address ? null : info.item;
            setSelectedWallet(wallet);
            return wallet;
          }}
        />
      );
    },
    [selectedWallet, setSelectedWallet],
  );

  const listKeyExtractor = useCallback((item: Wallet) => item.address, []);

  const debouncedGenerateWallet = useCallback(
    debounce(async (hdPath: HdPath) => {
      const wallet = await generateWalletFromHdPath(hdPath, params);
      setSelectedWallet(wallet);
    }, 2000),
    [generateWalletFromHdPath, params],
  );

  const onHdPathChange = useCallback(
    (hdPath: HdPath) => {
      setSelectedWallet(null);
      setSelectedHdPath(hdPath);
      debouncedGenerateWallet(hdPath);
    },
    [debouncedGenerateWallet, setSelectedWallet],
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
          {selectedWallet ? selectedWallet.address : `${t('generating address')}...`}
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

export default WalletPicker;
