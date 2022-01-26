import {HdPath} from "./hdpath";
import LocalWallet from "../wallet/LocalWallet";
import {OfflineSigner} from "@cosmjs/proto-signing";

/**
 * Enum that represents the type of a Wallet instance.
 */
export enum WalletType {
    /**
     * Wallet generated from a mnemonic of witch the key pair is stored
     * encrypted in the device storage.
     */
    Mnemonic,
    /**
     * Wallet imported from a Ledger device.
     */
    Ledger,
}

/**
 * Interface to define the common fields of each wallet type.
 */
interface IWallet {
    /**
     * The bech32 address.
     */
    address: string,
    /**
     * Derivation path used to derive the private key.
     */
    hdPath: HdPath,
    /**
     * cosmjs signer that can be used to sign and broadcast transactions.
     */
    signer: OfflineSigner,
}

/**
 * Interface that represents a wallet generated from a mnemonic.
 */
export interface MnemonicWallet extends IWallet {
    type: WalletType.Mnemonic,
    localWallet: LocalWallet,
}

/**
 * Interface that represents a Ledger wallet.
 */
export interface LedgerWallet extends IWallet {
    type: WalletType.Ledger,
}

export type Wallet = MnemonicWallet | LedgerWallet;