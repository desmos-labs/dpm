import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { MsgLinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import LoadingModal from 'modals/LoadingModal';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import useAddChainLink from 'hooks/useAddChainLink';
import useSelectedAccount from 'hooks/useSelectedAccount';
import useShowModal from 'hooks/useShowModal';
import { CosmosHdPath, HdPath } from 'types/cosmos';
import {
  AccountScreensStackParams,
  ChainLinkScreensStackParams,
  ImportMode,
} from 'types/navigation';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import HdPathPicker from 'components/HdPathPicker';
import Divider from 'components/Divider';
import PaginatedFlatList from 'components/PaginatedFlatList';
import ListItemSeparator from 'components/ListItemSeparator';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import useGenerateProof from 'hooks/chainlinks/useGenerateProof';
import generateWalletFromHDPaths from 'hooks/wallet/generateWalletFromHDPaths';
import {Wallet} from 'types/wallet';
import useGetWalletAccounts from 'hooks/wallet/useGetWalletAccounts';
import useConfirmTx from 'hooks/useConfirmTx';
import useRenderListItem from './useHooks';
import useStyles from './useStyles';

export type Props = CompositeScreenProps<
  StackScreenProps<ChainLinkScreensStackParams, 'PickAddress'>,
  StackScreenProps<AccountScreensStackParams>
>;

const PickAddress: React.FC<Props> = (props) => {
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

  const showModal = useShowModal();

  const chainInfo = useCurrentChainInfo();
  const selectedAccount = useSelectedAccount();
  const addChainLink = useAddChainLink(selectedAccount.address);
  const generateProof = useGenerateProof();
  const confirmTx = useConfirmTx(chainInfo, feeGranter, backAction);

  const {fetchingWallets, fetchWallets} = useGetWalletAccounts(importMode, chain, selectedHdPath, {mnemonic, ledgerApp, ledgerTransport});
  const generateWalletFromHdPath = generateWalletFromHDPaths(importMode, chain, {mnemonic, ledgerApp, ledgerTransport});

  useEffect(() => {
    (async () => {
      const wallet = await generateWalletFromHdPath(selectedHdPath);
      setSelectedWallet(wallet);
    })();
  }, []);

  const toggleAddressPicker = useCallback(() => {
    setAddressPickerVisible((visible) => {
      if (!visible) {
        // The address picker is being displayed,
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

  const listKeyExtractor = useCallback((item: Wallet, _: number) => item.address, []);
  const renderListItem = useRenderListItem(selectedWallet, (hdPath, address, info) => {
    setSelectedWallet((old) => (old?.address === address ? null : info.item));
    setSelectedHdPath(hdPath);
  });

  const debouncedGenerateWallet = useCallback(debounce(async (hdPath: HdPath) => {
    const wallet = await generateWalletFromHdPath(hdPath);
    setSelectedWallet(wallet);
  }, 2000), [generateWalletFromHdPath]);

  const onHdPathChange = useCallback((hdPath: HdPath) => {
    setSelectedWallet(null);
    setSelectedHdPath(hdPath);
    debouncedGenerateWallet(hdPath);
  }, [debouncedGenerateWallet]);

  const onNextPressed = useCallback(async () => {
    if (selectedWallet !== null) {
      let closeModal;
      if (importMode === ImportMode.Ledger) {
        closeModal = showModal(LoadingModal, {
          text: t('waiting ledger confirmation'),
        });
      }

      try {
        // Generate the proof
        const proof = await generateProof({
          desmosAddress: selectedAccount.address,
          externalAddress: selectedWallet.address,
          externalChainWallet: selectedWallet.signer,
          chain,
        });

        // Close the Ledger modal if opened
        if (closeModal !== undefined) {
          closeModal();
        }

        // Build the message
        const msg: MsgLinkChainAccountEncodeObject = {
          typeUrl: '/desmos.profiles.v3.MsgLinkChainAccount',
          value: MsgLinkChainAccount.fromPartial({
            signer: selectedAccount.address,
            proof: proof.proof,
            chainConfig: proof.chainConfig,
            chainAddress: proof.chainAddress,
          }),
        };

        // Confirm the transaction
        confirmTx(msg, () => {
          addChainLink({
            externalAddress: selectedWallet.address!,
            chainName: proof.chainConfig.name,
            userAddress: selectedAccount.address,
            creationTime: new Date(),
          });
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
    chainInfo.stakeCurrency.coinDenom,
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

      <TouchableOpacity onPress={toggleAddressPicker} disabled={fetchingWallets}>
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
        <Flexible.Padding flex={1} />
      )}
      <Button
        style={styles.nextButton}
        mode="contained"
        onPress={onNextPressed}
        disabled={selectedWallet === null || fetchingWallets}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default PickAddress;
