import {useCallback} from 'react';
import {HdPath} from 'types/hdpath';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {ImportMode} from 'types/navigation';
import {LinkableChain} from 'types/chain';
import {LedgerApp} from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {Wallet} from 'types/wallet';
import useGetMnemonicSigner from 'hooks/wallet/useGetMnemonicSigner';
import useGetLedgerSigner from 'hooks/wallet/useGetLedgerSigner';

const useGenerateWalletFromHDPath = (importMode: ImportMode, chain: LinkableChain, options: {
  mnemonic?: string,
  ledgerApp?: LedgerApp,
  ledgerTransport?: BluetoothTransport
}) => {
  const getMnemonicSigner = useGetMnemonicSigner();
  const getLedgerSigner = useGetLedgerSigner();

  return useCallback(async (hdPath: HdPath) => {
      try {
        let signer: OfflineSigner | null;
        switch (importMode) {
          case ImportMode.Ledger:
            signer = await getLedgerSigner(chain.prefix, hdPath, options.ledgerApp, options.ledgerTransport);
            break;

          case ImportMode.Mnemonic:
            signer = await getMnemonicSigner(chain.prefix, hdPath, options.mnemonic);
            break;
        }

        if (signer == null) {
          return null;
        }

        const { address } = (await signer.getAccounts())[0];
        return {signer,  hdPath, address} as Wallet;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    [importMode, chain, options],
  );
};

export default useGenerateWalletFromHDPath;
