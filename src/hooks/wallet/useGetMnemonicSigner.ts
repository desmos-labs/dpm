import LocalWallet from 'wallet/LocalWallet';
import {HdPath} from 'types/hdpath';

const useGetMnemonicSigner = () => (chainPrefix: string, hdPath: HdPath, mnemonic?: string) => {
  if (!mnemonic) {
    return null;
  }

  return LocalWallet.fromMnemonic(mnemonic, {
    hdPath,
    prefix: chainPrefix,
  });
 };

export default useGetMnemonicSigner;
