import {HdPath} from 'types/hdpath';
import LocalWallet from 'wallet/LocalWallet';
import {ExternalWallet} from 'types/wallet';

const useGenerateWalletsFromMnemonic = () => async (mnemonic: string, prefix: string, hdPaths: HdPath[]) => {
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
      } as ExternalWallet;
    }),
  );
};

export default useGenerateWalletsFromMnemonic;
