import {HdPath} from "../types/hdpath";
import {HdPath as CosmjsHdPath, Slip10RawIndex} from "@cosmjs/crypto"

/**
 * Converts our hdpath object to a cosmjs hdpath object.
 * @param hdPath hdpath object to covert.
 */
export function toCosmjsHdPath(hdPath: HdPath): CosmjsHdPath {
    return [
        Slip10RawIndex.hardened(44),
        Slip10RawIndex.hardened(hdPath.coinType),
        Slip10RawIndex.hardened(hdPath.account),
        Slip10RawIndex.normal(hdPath.change),
        Slip10RawIndex.normal(hdPath.addressIndex),
    ]
}