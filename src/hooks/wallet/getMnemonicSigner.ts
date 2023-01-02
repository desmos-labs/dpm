import {OfflineSignerAdapter, Signer, SigningMode} from '@desmoslabs/desmjs';
import {HdPath} from '@cosmjs/crypto';

/**
 * Hook allowing to get a [Signer] instance that relies on a mnemonic.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param mnemonic - Mnemonic from which to generate the wallet.
 */
const getMnemonicSigner = async (prefix: string, hdPaths: HdPath[], mnemonic: string): Promise<Signer> => {
  return OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, mnemonic, {
    prefix,
    hdPath: hdPaths,
  });
 };

export default getMnemonicSigner;
