import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as secp256k1 from 'secp256k1';
import {RIPEMD160} from 'jscrypto/RIPEMD160';
import {SHA256} from 'jscrypto/SHA256';
import {bech32} from 'bech32';
import {Hex} from 'jscrypto';

// See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for the list of all slips.
const DESMOS_COIN_TYPE = 852;

export interface LocalWalletOptions {
    /**
     * BIP44 account number.
     */
    account?: number;

    /**
     * BIP44 index number
     */
    index?: number;
}

const DEFAULT_OPTIONS: LocalWalletOptions = {
    account: 0,
    index: 0,
};

export default class LocalWallet {
    readonly derivationPath: string;
    private readonly privateKey: Buffer;
    private readonly publicKey: Buffer;
    private readonly rawAddress: Buffer;

    constructor(derivationPath: string, privateKey: Buffer) {
        this.derivationPath = derivationPath;
        this.privateKey = privateKey;
        this.publicKey = Buffer.from(
            secp256k1.publicKeyCreate(this.privateKey, true),
        );

        const message = Hex.parse(this.publicKey.toString('hex'));
        const hash = RIPEMD160.hash(SHA256.hash(message)).toString();
        const address = Buffer.from(hash, 'hex');
        this.rawAddress = Buffer.from(bech32.toWords(address));
    }

    static fromMnemonic(
        mnemonic: string,
        options?: LocalWalletOptions,
    ): LocalWallet {
        const {account, index} = {...DEFAULT_OPTIONS, ...options};
        const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic);
        const masterKey = bip32.fromSeed(seed);
        const derivationPath = `m/44'/${DESMOS_COIN_TYPE}'/${account}'/0/${index}`;
        const keyPair = masterKey.derivePath(derivationPath);
        const privateKey = keyPair.privateKey;

        if (privateKey === undefined) {
            throw new Error('Failed to derive key pair');
        }

        return new LocalWallet(derivationPath, keyPair.privateKey!);
    }

    async sign(payload: Buffer): Promise<Buffer> {
        const hash = Buffer.from(
            SHA256.hash(payload.toString()).toString(),
            'hex',
        );
        const sign = secp256k1.ecdsaSign(
            Uint8Array.from(hash),
            Uint8Array.from(this.privateKey),
        );

        return Buffer.from(sign.signature);
    }

    public get bech32Address(): string {
        return bech32.encode('desmos', Array.from(this.rawAddress));
    }

    public serialize(): string {
        const json = {
            version: 1,
            privateKey: this.privateKey.toString('base64'),
            derivationPath: this.derivationPath,
        };
        return JSON.stringify(json);
    }

    public static deserialize(serialized: string): LocalWallet {
        const json = JSON.parse(serialized);

        if (
            json.version === undefined ||
            json.privateKey === undefined ||
            json.derivationPath === undefined
        ) {
            throw new Error('Invalid data');
        }

        const privateKey = new Buffer(json.privateKey, 'base64');
        return new LocalWallet(json.derivationPath, privateKey);
    }
}

export function randomMnemonic(wordCount: number = 24): string {
    if (wordCount !== 12 && wordCount !== 24) {
        throw new Error('Can be generated mnemonic only with length 24 or 12');
    }

    const strength = wordCount === 24 ? 256 : 128;
    return bip39.generateMnemonic(strength);
}

export function checkMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
}
