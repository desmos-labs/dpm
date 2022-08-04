import { LedgerApp as CosmosLedgerApp, LedgerSigner } from '@cosmjs/ledger-amino';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { MsgLinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import {
  AddressListItem,
  Button,
  Divider,
  HdPathPicker,
  ListItemSeparator,
  PaginatedFlatList,
  StyledSafeAreaView,
  TopBar,
} from '../../components';
import { FlexPadding } from '../../components/FlexPadding';
import useCurrentChainInfo from '../../hooks/desmosclient/useCurrentChainInfo';
import useAddChinLink from '../../hooks/useAddChainLink';
import useSelectedAccount from '../../hooks/useSelectedAccount';
import useShowModal from '../../hooks/useShowModal';
import { LoadingModal } from '../../modals/LodingModal';
import { makeStyle } from '../../theming';
import { computeTxFees, messagesGas } from '../../types/fees';
import { CosmosHdPath, HdPath } from '../../types/hdpath';
import { LedgerApp } from '../../types/ledger';
import {
  AccountScreensStackParams,
  ChainLinkScreensStackParams,
  ImportMode,
} from '../../types/navigation';
import { generateProof } from '../../utilils/chainlink';
import toCosmjsHdPath from '../../utilils/hdpath';
import TerraLedgerApp from '../../utilils/terra';
import LocalWallet from '../../wallet/LocalWallet';
import { Typography } from '../../components/typography';

type Wallet = {
  signer: OfflineSigner;
  address: string;
  hdPath: HdPath;
};

export type Props = CompositeScreenProps<
  StackScreenProps<ChainLinkScreensStackParams, 'PickAddress'>,
  StackScreenProps<AccountScreensStackParams>
>;

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
        address: signer.bech32Address,
        signer,
        hdPath,
      };
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
  if (ledgerApp!.name === 'Terra') {
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
    signer: ledgerSigner,
    hdPath: hdPaths[index],
    address: account.address,
  }));
}

export const PickAddress: React.FC<Props> = (props) => {
  const { navigation, route } = props;
  const { mnemonic, importMode, chain, feeGranter, backAction, ledgerTransport, ledgerApp } =
    route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const defaultHdPath = useMemo(() => {
    if (importMode === ImportMode.Mnemonic) {
      return chain.hdPath;
    }
    if (ledgerApp!.name === 'Cosmos') {
      return CosmosHdPath;
    }
    return chain.hdPath;
  }, [chain.hdPath, importMode, ledgerApp]);
  const [selectedHdPath, setSelectedHdPath] = useState<HdPath>(defaultHdPath);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [addressPickerVisible, setAddressPickerVisible] = useState(false);
  const [, setGenerationError] = useState<string | null>(null);
  const [generatingAddresses, setGeneratingAddresses] = useState(false);
  const chainInfo = useCurrentChainInfo();
  const selectedAccount = useSelectedAccount();
  const addChainLink = useAddChinLink(selectedAccount.address);
  const showModal = useShowModal();
  const generateWalletFromHdPath = useCallback(
    async (hdPath: HdPath) => {
      try {
        let signer: OfflineSigner;
        if (importMode === ImportMode.Mnemonic) {
          signer = await LocalWallet.fromMnemonic(mnemonic!, {
            hdPath,
            prefix: chain.prefix,
          });
        } else {
          let cosmosLedgerApp: CosmosLedgerApp | undefined;
          if (ledgerApp!.name === 'Terra') {
            cosmosLedgerApp = new TerraLedgerApp(ledgerTransport!);
          }
          signer = new LedgerSigner(ledgerTransport!, {
            minLedgerAppVersion: ledgerApp!.minVersion,
            ledgerAppName: ledgerApp!.name,
            hdPaths: [toCosmjsHdPath(hdPath)],
            prefix: chain.prefix,
            ledgerApp: cosmosLedgerApp,
          });
        }
        const { address } = (await signer.getAccounts())[0];

        return {
          signer,
          hdPath,
          address,
        } as Wallet;
      } catch (e) {
        setGenerationError(e.toString());
        return null;
      }
    },
    [importMode, mnemonic, chain.prefix, ledgerTransport, ledgerApp]
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
        generateWalletFromHdPath(defaultHdPath).then(setSelectedWallet);
      }
      return !visible;
    });
  }, [generateWalletFromHdPath, selectedWallet, defaultHdPath]);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<Wallet>) => {
      const { hdPath, address } = info.item;
      return (
        <AddressListItem
          number={hdPath.account}
          address={address}
          highlight={selectedWallet?.address === address}
          onPress={() => {
            setSelectedWallet((old) => (old?.address === address ? null : info.item));
            setSelectedHdPath(hdPath);
          }}
        />
      );
    },
    [selectedWallet]
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
    [debouncedGenerateWallet]
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
      if (importMode === ImportMode.Mnemonic) {
        wallets = await generateWalletsFromMnemonic(mnemonic!, chain.prefix, hdPaths);
      } else {
        wallets = await generateWalletsFromLedger(
          ledgerTransport!,
          ledgerApp!,
          chain.prefix,
          hdPaths
        );
      }
      setGeneratingAddresses(false);
      return wallets;
    },
    [chain.prefix, importMode, ledgerApp, ledgerTransport, mnemonic, selectedHdPath.coinType]
  );

  const onNextPressed = useCallback(async () => {
    if (selectedWallet !== null) {
      let closeModal;
      if (importMode === ImportMode.Ledger) {
        closeModal = showModal(LoadingModal, {
          text: t('waiting ledger confirmation'),
        });
      }
      try {
        const proof = await generateProof({
          desmosAddress: selectedAccount.address,
          externalAddress: selectedWallet.address,
          externalChainWallet: selectedWallet.signer,
          chain,
        });

        console.log('proof', proof);

        if (closeModal !== undefined) {
          closeModal();
        }

        const msg: MsgLinkChainAccountEncodeObject = {
          typeUrl: '/desmos.profiles.v3.MsgLinkChainAccount',
          value: MsgLinkChainAccount.fromPartial({
            signer: selectedAccount.address,
            proof: proof.proof,
            chainConfig: proof.chainConfig,
            chainAddress: proof.chainAddress,
          }),
        };
        const messages = [msg];
        const gas = messagesGas(messages);
        const fee = computeTxFees(gas, chainInfo.stakingDenom).average;
        navigation.navigate({
          name: 'ConfirmTx',
          params: {
            messages,
            fee,
            feeGranter,
            backAction,
            successAction: () => {
              addChainLink({
                externalAddress: selectedWallet.address!,
                chainName: proof.chainConfig.name,
                userAddress: selectedAccount.address,
                creationTime: new Date(),
              });
            },
          },
        });
      } catch (e) {
        if (closeModal !== undefined) {
          closeModal();
        }
      }
    }
  }, [
    selectedWallet,
    importMode,
    chain,
    selectedAccount.address,
    chainInfo.stakingDenom,
    navigation,
    feeGranter,
    backAction,
    showModal,
    t,
    addChainLink,
  ]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('import account')} />}
    >
      <Typography.Body>{t('select account or enter derivation path')}.</Typography.Body>

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
        allowCoinTypeEdit={importMode === ImportMode.Mnemonic}
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
      ) : (
        <FlexPadding flex={1} />
      )}
      <Button
        style={styles.nextButton}
        mode="contained"
        onPress={onNextPressed}
        disabled={selectedWallet === null || generatingAddresses}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
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
  nextButton: {
    marginTop: theme.spacing.m,
  },
  disabledText: {
    color: theme.colors.disabled,
  },
}));
