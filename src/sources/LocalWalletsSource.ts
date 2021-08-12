import * as SecureStorage from '../utilils/SecureStorage';
import LocalWallet from '../wallet/LocalWallet';

export class LocalWalletsSource {
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

    public async putWallet(
        wallet: LocalWallet,
        password: string,
        biometricProtected?: boolean,
    ): Promise<void> {
        const addresses = await this.getAllAddresses();

        if (addresses.indexOf(wallet.bech32Address) === -1) {
            addresses.push(wallet.bech32Address);
            await SecureStorage.setItem('addresses', JSON.stringify(addresses));
        }

        await SecureStorage.setItem(
            `${wallet.bech32Address}_wallet`,
            wallet.serialize(),
            {
                password,
                biometrics: biometricProtected,
            },
        );
    }

    public async getWallet(
        address: string,
        password: string,
        biometricProtected?: boolean,
    ): Promise<LocalWallet> {
        const serialized = await SecureStorage.getItem(`${address}_wallet`, {
            password,
            biometrics: biometricProtected,
        });

        if (serialized === null) {
            throw new Error(`Can't find wallet for address ${address}`);
        }

        return LocalWallet.deserialize(serialized);
    }

    public async removeWallet(address: string): Promise<void> {
        await SecureStorage.deleteItem(address);
    }
}

const WalletSource = new LocalWalletsSource();

export default WalletSource;
