import * as bip39 from 'bip39';
import {
    sha256,
    Secp256k1
} from "@cosmjs/crypto";
import {DesmosHdPath, HdPath} from "../types/hdpath";
import {DirectSignResponse, OfflineDirectSigner, AccountData, makeSignBytes} from "@cosmjs/proto-signing";
import {SignDoc} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {encodeSecp256k1Signature, rawSecp256k1PubkeyToRawAddress} from "@cosmjs/amino";
import {Bech32, fromBase64, fromHex, toBase64} from "@cosmjs/encoding";
import {CryptoUtils} from "../native/CryptoUtils";

export interface LocalWalletOptions {
    /**
     * Wallet HdPath.
     */
    hdPath?: HdPath,
    /**
     * Prefix of the bech32 address.
     */
    prefix?: string
}

const DEFAULT_OPTIONS = {
    hdPath: DesmosHdPath,
    prefix: "desmos",
};

export default class LocalWallet implements OfflineDirectSigner {
    private readonly prefix: string;
    private readonly privateKey: Uint8Array;
    readonly publicKey: Uint8Array;
    private readonly _address: string;

    /**
     *
     * @param prefix - Prefix of the bech32 address.
     * @param privateKey - The private key.
     * @param publicKey - The compressed public key.
     */
    constructor(prefix: string, privateKey: Uint8Array, publicKey: Uint8Array) {
        this.prefix = prefix;
        this.privateKey = privateKey;
        this.publicKey = publicKey
        this._address = Bech32.encode(prefix, rawSecp256k1PubkeyToRawAddress(publicKey));
    }

    static async fromMnemonic(
        mnemonic: string,
        options?: LocalWalletOptions,
    ): Promise<LocalWallet> {
        const {hdPath, prefix} = {...DEFAULT_OPTIONS, ...options};
        const {privkey, pubkey} = await CryptoUtils.deriveKeyPairFromMnemonic(mnemonic,
            hdPath.coinType, hdPath.account, hdPath.change, hdPath.addressIndex);
        const privkeyBytes = fromHex(privkey)
        const pubkeyBytes = fromHex(pubkey)
        const compressedPubKey = await Secp256k1.compressPubkey(pubkeyBytes);
        return new LocalWallet(prefix, privkeyBytes, compressedPubKey);
    }

    async sign(payload: Uint8Array): Promise<Uint8Array> {
        const hashedMessage = sha256(payload);
        const signature = await Secp256k1.createSignature(hashedMessage, this.privateKey);
        return new Uint8Array([...signature.r(32), ...signature.s(32)]);
    }

    public get bech32Address(): string {
        return this._address;
    }

    public serialize(): string {
        const json = {
            version: 3,
            privateKey: toBase64(this.privateKey),
            publicKey: toBase64(this.publicKey),
            prefix: this.prefix,
        };
        return JSON.stringify(json);
    }

    public static async deserialize(serialized: string): Promise<LocalWallet> {
        const json = JSON.parse(serialized);

        if (
            json.version === undefined ||
            json.privateKey === undefined
        ) {
            throw new Error('Invalid data');
        }

        let publicKey: Uint8Array;
        const privateKey = fromBase64(json.privateKey);

        if (json.version === 1) {
            const { pubkey } = await Secp256k1.makeKeypair(privateKey);
            publicKey = await Secp256k1.compressPubkey(pubkey)
        } else {
            if (json.publicKey === undefined) {
                throw new Error('Invalid data');
            } else {
                publicKey = fromBase64(json.publicKey);
            }
        }
        // Handle case of old wallets.
        const prefix = json.prefix ?? DEFAULT_OPTIONS.prefix;

        return new LocalWallet(prefix, privateKey, publicKey);
    }

    async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
        if (signerAddress !== this.bech32Address) {
            throw new Error("Signer address not valid");
        }

        const serialized = makeSignBytes(signDoc);
        const signature = await this.sign(serialized);
        const stdSignature = encodeSecp256k1Signature(Uint8Array.from(this.publicKey), signature);
        return {
            signed: signDoc,
            signature: stdSignature,
        };
    }

    async getAccounts(): Promise<readonly AccountData[]> {
        const data: AccountData = {
            address: this.bech32Address,
            algo: "secp256k1",
            pubkey: this.publicKey,
        }
        return [data]
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
