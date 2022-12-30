import { toBase64 } from '@cosmjs/encoding';
import { LedgerSigner } from '@cosmjs/ledger-amino';
import { LedgerApp as CosmosLedgerApp } from '@cosmjs/ledger-amino/build/ledgerapp';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { makeStyle } from '../../../../theming';
import { HdPath } from '../../../../types/hdpath';
import { LedgerApp } from '../../../../types/ledger';
import { Wallet, WalletType } from '../../../../types/wallet';
import toCosmjsHdPath from '../../../../utilils/hdpath';
import TerraLedgerApp from '../../../../utilils/terra';
import LocalWallet from '../../../../wallet/LocalWallet';
import { AddressListItem , Divider , HdPathPicker , ListItemSeparator , PaginatedFlatList } from '../../../../components';
import { Typography } from '../../../../components/Typography';

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

export const WalletPicker: React.FC<WalletPickerProps> = ({
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
  const [generatingAddresses, setGeneratingAddresses] = useState(false);
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
    [addressPrefix, ledgerApp, ledgerTransport, mnemonic]
  );

  useEffect(() => {
    (async () => {
      const wallet = await generateWalletFromHdPath(selectedHdPath);
      setSelectedWallet(wallet);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const { hdPath, address } = info.item;
      return (
        <AddressListItem
          number={hdPath.account}
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
    [selectedWallet, setSelectedWallet]
  );

  const listKeyExtractor = useCallback((item: Wallet, _: number) => item.address, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGenerateWallet = useCallback(
    debounce(async (hdPath: HdPath) => {
      const wallet = await generateWalletFromHdPath(hdPath);
      setSelectedWallet(wallet);
    }, 2000),
    [generateWalletFromHdPath]
  );

  const onHdPathChange = useCallback(
    (hdPath: HdPath) => {
      setSelectedWallet(null);
      setSelectedHdPath(hdPath);
      debouncedGenerateWallet(hdPath);
    },
    [debouncedGenerateWallet, setSelectedWallet]
  );

  const fetchWallets = useCallback(
    async (offset: number, limit: number) => {
      setGeneratingAddresses(true);
      const hdPaths: HdPath[] = [];
      for (let walletIndex = offset; walletIndex < limit; walletIndex += 1) {
        const hdPath: HdPath = {
          coinType: selectedHdPath.coinType,
          account: walletIndex,
          change: 0,
          addressIndex: 0,
        };
        hdPaths.push(hdPath);
      }
      let wallets: Wallet[];
      if (mnemonic !== undefined) {
        wallets = await generateWalletsFromMnemonic(mnemonic!, addressPrefix, hdPaths);
      } else {
        wallets = await generateWalletsFromLedger(
          ledgerTransport!,
          ledgerApp!,
          addressPrefix,
          hdPaths
        );
      }
      setGeneratingAddresses(false);
      return wallets;
    },
    [
      addressPrefix,
      ledgerApp,
      ledgerTransport,
      mnemonic,
      selectedHdPath.coinType,
      setGeneratingAddresses,
    ]
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
  mnemonic: string,
  prefix: string,
  hdPaths: HdPath[]
): Promise<Wallet[]> {
  return Promise.all(
    hdPaths.map(async (hdPath) => {
      const signer = await LocalWallet.fromMnemonic(mnemonic, {
        hdPath,
        prefix,
      });
      return {
        type: WalletType.Mnemonic,
        address: signer.bech32Address,
        localWallet: signer,
        signer,
        hdPath,
        pubKey: toBase64(signer.publicKey),
        signAlgorithm: 'secp256k1',
      } as Wallet;
    })
  );
}

async function generateWalletsFromLedger(
  transport: BluetoothTransport,
  ledgerApp: LedgerApp,
  prefix: string,
  hdPaths: HdPath[]
): Promise<Wallet[]> {
  const cosmJsPaths = hdPaths.map(toCosmjsHdPath);

  let cosmosLedgerApp: CosmosLedgerApp | undefined;
  if (ledgerApp.name === 'Terra') {
    cosmosLedgerApp = new TerraLedgerApp(transport!);
  }

  const ledgerSigner = new LedgerSigner(transport, {
    ledgerAppName: ledgerApp.name,
    minLedgerAppVersion: ledgerApp.minVersion,
    hdPaths: cosmJsPaths,
    prefix,
    ledgerApp: cosmosLedgerApp,
  });

  const accounts = await ledgerSigner.getAccounts();
  return accounts.map((account, index) => ({
    type: WalletType.Ledger,
    signer: ledgerSigner,
    hdPath: hdPaths[index],
    address: account.address,
    signAlgorithm: account.algo,
    pubKey: toBase64(account.pubkey),
  }));
}

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
  },
  hpPathLabel: {
    marginTop: theme.spacing.l,
  },
  hdPathPicker: {
    marginTop: theme.spacing.s,
  },
  addressText: {
    marginTop: theme.spacing.m,
  },
  dividerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  dividerLine: {
    flex: 4,
  },
  dividerText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  toggleSelectAccount: {
    marginTop: theme.spacing.l,
  },
  toggleSelectAccountEnabled: {
    color: theme.colors.primary,
  },
  addressesList: {
    flex: 1,
    marginTop: theme.spacing.s,
  },
  disabledText: {
    color: theme.colors.disabled,
  },
}));
