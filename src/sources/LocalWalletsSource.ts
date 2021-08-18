import * as SecureStorage from '../utilils/SecureStorage';
import LocalWallet from '../wallet/LocalWallet';

/**
 * Source that contains the user's wallets.
 */
export class LocalWalletsSource {

    /**
     * Gets the bech32 addresses of al the user's wallets.
     */
    public async getAllAddresses(): Promise<string[]> {
        try {
            const content = await SecureStorage.getItem('addresses');
            if (content !== null) {
                return JSON.parse(content);
            }
        } catch (e) {
            console.error(
                'Error while reading all the address: ' + e.toString(),
            );
        }

        return [];
    }

    /**
     * Puts a wallet into the device storage.
     * @param wallet - The wallet to be saved.
     * @param password - Password used to protect the user wallet.
     * @param accessWithBiometrics - True if the wallet can be unlocked with the biometrics instead of the password.
     */
    public async putWallet(
        wallet: LocalWallet,
        password: string,
        accessWithBiometrics?: boolean,
    ): Promise<void> {
        const addresses = await this.getAllAddresses();
        // Saves the wallet address.
        if (addresses.indexOf(wallet.bech32Address) === -1) {
            addresses.push(wallet.bech32Address);
            await SecureStorage.setItem('addresses', JSON.stringify(addresses));
        }

        if (accessWithBiometrics === true) {
            // If can be accessed with the biometrics secure the wallet password with the user's biometrics.
            await SecureStorage.setItem(`${wallet.bech32Address}_key`, password,
                {
                    biometrics: true,
                },
            );
        } else {
            await SecureStorage.deleteItem(`${wallet.bech32Address}_key`);
        }

        await SecureStorage.setItem(`${wallet.bech32Address}_wallet`, wallet.serialize(),
            {
                password,
            },
        );
    }

    /**
     * Gets a wallet from the device storage.
     * @param address - bech32 address of the wallet of interest.
     * @param password - Password to decipher the wallet.
     * @param useBiometrics - If true the password field will be ignored and the wallet will be unlocked using.
     * the user's biometrics.
     */
    public async getWallet(
        address: string,
        password?: string,
        useBiometrics?: boolean,
    ): Promise<LocalWallet> {
        let walletPassword: string | null = password ?? null;
        if (useBiometrics === true) {
            walletPassword = await SecureStorage.getItem(`${address}_key`,
                {
                    biometrics: true,
                },
            );
        }

        if (walletPassword === null) {
            if (useBiometrics === true) {
                throw new Error(`Biometrics not enabled for wallet with address ${address}`)
            } else {
                throw new Error("Can't access the wallet without the password")
            }
        }

        let serializedWallet = await SecureStorage.getItem(`${address}_wallet`, {
            password: walletPassword,
        });


        if (serializedWallet === null) {
            throw new Error(`Can't find wallet for address ${address}`);
        }

        return LocalWallet.deserialize(serializedWallet);
    }

    /**
     * Deletes a wallet from the device storage
     * @param address - bech32 address of the wallet to delete.
     */
    public async removeWallet(address: string): Promise<void> {
        // Remove the address from the cache
        const addresses = await this.getAllAddresses();
        const addressIndex = addresses.indexOf(address);
        if (addressIndex !== -1) {
            addresses.splice(addressIndex, 1);
            await SecureStorage.setItem('addresses', JSON.stringify(addresses));
        }

        // Remove the wallet
        await SecureStorage.deleteItem(`${address}_wallet`);
        // Remove the key
        await SecureStorage.deleteItem(`${address}_key`);
    }
}

const WalletSource = new LocalWalletsSource();

export default WalletSource;
