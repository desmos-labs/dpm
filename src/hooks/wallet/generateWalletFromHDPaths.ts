import getLedgerSigner from 'hooks/wallet/getLedgerSigner';
import Wallet, {WalletGenerationData, WalletType} from 'types/wallet';
import getMnemonicSigner from 'hooks/wallet/getMnemonicSigner';
import {Signer} from '@desmoslabs/desmjs';
import {HdPath} from '@cosmjs/crypto';

const generateWalletFromHDPaths = async (data: WalletGenerationData, hdPaths?: HdPath[]): Promise<Wallet> => {
  let signer: Signer;
  switch (data.type) {
    case WalletType.Ledger:
      if (!hdPaths || hdPaths.length === 0) {
        return Promise.reject(new Error('At least one HD path needs to be specified'));
      }
      signer = await getLedgerSigner(data.accountPrefix, hdPaths, data.app, data.transport);
      break;

    case WalletType.Mnemonic:
      if (!hdPaths || hdPaths.length === 0) {
        return Promise.reject(new Error('At least one HD path needs to be specified'));
      }
      signer = await getMnemonicSigner(data.accountPrefix, hdPaths, data.mnemonic);
      break;

    default:
      return Promise.reject(new Error(`Cannot generate wallet from HD path for import type ${data.type}`));
  }

  return {
    type: data.type,
    signer,
    hdPaths,
  } as Wallet;
};

export default generateWalletFromHDPaths;
