import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LedgerApp } from 'types/ledger';
import { Wallet } from 'types/wallet';
import Typography from 'components/Typography';
import AddressListItem from 'components/AddressListItem';
import HdPathPicker from 'components/HdPathPicker';
import Divider from 'components/Divider';
import PaginatedFlatList from 'components/PaginatedFlatList';
import ListItemSeparator from 'components/ListItemSeparator';
import { HdPath } from '@cosmjs/crypto';
import useStyles from './useStyles';

export type WalletPickerProps = {
  /**
   * Base derivation path
   */
  defaultHdPath: HdPath;
  /**
   * Address prefix
   */
  addressPrefix: string;
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
   * Mnemonic used to generate the wallets.
   */
  mnemonic?: string;
  /**
   * transport to communicate with a Ledger device.
   */
  ledgerTransport?: BluetoothTransport;
  /**
   * Application that the user should have open on the Ledger.
   */
  ledgerApp?: LedgerApp;
  /**
   * Allow to edit derivation path coin type field.
   */
  allowCoinTypeEdit?: boolean;
  style?: StyleProp<ViewStyle>;
};

const WalletPicker: React.FC<WalletPickerProps> = ({
  defaultHdPath,
  addressPrefix,
  onGeneratingAddressesStateChange,
  onWalletSelected,
  mnemonic,
  ledgerTransport,
  ledgerApp,
  allowCoinTypeEdit,
  style,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [selectedHdPath, setSelectedHdPath] = useState<HdPath>(defaultHdPath);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(false);
  const [generatingAddresses] = useState(false);
  const [, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    onWalletSelected(selectedWallet);
  }, [selectedWallet, onWalletSelected]);

  useEffect(() => {
    onGeneratingAddressesStateChange(generatingAddresses);
  }, [generatingAddresses, onGeneratingAddressesStateChange]);

  const generateWalletFromHdPath = useCallback(
    async (hdPath: HdPath) => {
      try {
        let wallets: Wallet[];

        if (ledgerTransport !== undefined) {
          wallets = await generateWalletsFromLedger(ledgerTransport, ledgerApp!, addressPrefix, [
            hdPath,
          ]);
        } else {
          wallets = await generateWalletsFromMnemonic(mnemonic!, addressPrefix, [hdPath]);
        }

        return wallets[0];
      } catch (e) {
        console.error(e);
        setGenerationError(e.toString());
        return null;
      }
    },
    [addressPrefix, ledgerApp, ledgerTransport, mnemonic],
  );

  useEffect(() => {
    (async () => {
      const wallet = await generateWalletFromHdPath(selectedHdPath);
      setSelectedWallet(wallet);
    })();
  }, []);

  const toggleAddressPicker = useCallback(() => {
    setAddressPickerVisible((visible) => {
      if (!visible) {
        // The address picker is is being displayed,
        // remove the wallet generated from the derivation path.
        setSelectedWallet(null);
        setSelectedHdPath(defaultHdPath);
      } else if (selectedWallet === null) {
        setSelectedHdPath(defaultHdPath);
        generateWalletFromHdPath(defaultHdPath).then((wallet) => {
          setSelectedWallet(wallet);
        });
      }
      return !visible;
    });
  }, [setSelectedWallet, defaultHdPath, selectedWallet, generateWalletFromHdPath]);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<Wallet>) => {
      const { address } = info.item;
      return (
        <AddressListItem
          number={1}
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

  const listKeyExtractor = useCallback((item: Wallet, _: number) => item.address, []);
  const debouncedGenerateWallet = useCallback(
    debounce(async (hdPath: HdPath) => {
      const wallet = await generateWalletFromHdPath(hdPath);
      setSelectedWallet(wallet);
    }, 2000),
    [generateWalletFromHdPath],
  );

  const onHdPathChange = useCallback(
    (hdPath: HdPath) => {
      setSelectedWallet(null);
      setSelectedHdPath(hdPath);
      debouncedGenerateWallet(hdPath);
    },
    [debouncedGenerateWallet, setSelectedWallet],
  );

  const fetchWallets = useCallback(
    async (_offset: number, _limit: number) => {
      return [];
    },
    [],
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
        allowCoinTypeEdit={ledgerTransport === undefined && allowCoinTypeEdit}
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

async function generateWalletsFromMnemonic(
  _mnemonic: string,
  _prefix: string,
  _hdPaths: HdPath[],
): Promise<Wallet[]> {
  return Promise.resolve([]);
}

async function generateWalletsFromLedger(
  _transport: BluetoothTransport,
  _ledgerApp: LedgerApp,
  _prefix: string,
  _hdPaths: HdPath[],
): Promise<Wallet[]> {
  return Promise.resolve([]);
}

export default WalletPicker;
