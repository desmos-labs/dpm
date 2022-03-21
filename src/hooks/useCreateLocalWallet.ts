import LocalWallet, { LocalWalletOptions } from '../wallet/LocalWallet';

/**
 * Hook to create a wallet that is stored into the device storage.
 * Returns a stateful variable that provides the wallet creation status and a function to create
 * a wallet from a recovery passphrase(mnemonic).
 */
export default function useCreateLocalWallet() {
	return (
		userMnemonic: string,
		options?: LocalWalletOptions
	): Promise<LocalWallet> => {
		return new Promise((resolve, reject) => {
			const creationTask = () => {
				try {
					const wallet = LocalWallet.fromMnemonic(userMnemonic!, options);
					resolve(wallet);
				} catch (ex) {
					reject(ex);
				}
			};

			if (userMnemonic !== null) {
				// Use a timeout to allow refresh of the ui before doing the crypto operations.
				setTimeout(creationTask, 20);
			}
		});
	};
}
