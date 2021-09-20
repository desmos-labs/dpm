import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as secp256k1 from 'secp256k1';
import {RIPEMD160} from 'jscrypto/RIPEMD160';
import {SHA256} from 'jscrypto/SHA256';
import {bech32} from 'bech32';
import {Hex} from 'jscrypto';
import {sha256} from "@cosmjs/crypto";
import {HdPath} from "../types/hdpath";

// See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for the list of all slips.
const DESMOS_COIN_TYPE = 852;

export interface LocalWalletOptions {
    /**
     * Wallet HdPath.
     */
    hdPath: HdPath,
}

const DEFAULT_OPTIONS: LocalWalletOptions = {
    hdPath: {
        account: 0,
        change: 0,
        addressIndex: 0,
    }
};

export default class LocalWallet {
    private readonly privateKey: Buffer;
    readonly publicKey: Buffer;
    private readonly rawAddress: Buffer;

    constructor(privateKey: Buffer) {
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
        const {hdPath} = {...DEFAULT_OPTIONS, ...options};
        const seed: Buffer = bip39.mnemonicToSeedSync(mnemonic);
        const masterKey = bip32.fromSeed(seed);
        const derivationPath = `m/44'/${DESMOS_COIN_TYPE}'/${hdPath.account}'/${hdPath.change}/${hdPath.addressIndex}`;
        const keyPair = masterKey.derivePath(derivationPath);

        if (keyPair.privateKey === undefined) {
            throw new Error('Failed to derive key pair');
        }

        return new LocalWallet(keyPair.privateKey);
    }

    async sign(payload: Uint8Array): Promise<Uint8Array> {
        const hash = sha256(Uint8Array.from(payload));
        const sign = secp256k1.ecdsaSign(
            hash,
            Uint8Array.from(this.privateKey),
        );

        return sign.signature;
    }

    public get bech32Address(): string {
        return bech32.encode('desmos', Array.from(this.rawAddress));
    }

    public serialize(): string {
        const json = {
            version: 1,
            privateKey: this.privateKey.toString('base64'),
        };
        return JSON.stringify(json);
    }

    public static deserialize(serialized: string): LocalWallet {
        const json = JSON.parse(serialized);

        if (
            json.version === undefined ||
            json.privateKey === undefined
        ) {
            throw new Error('Invalid data');
        }

        const privateKey = Buffer.from(json.privateKey, 'base64');
        return new LocalWallet(privateKey);
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
