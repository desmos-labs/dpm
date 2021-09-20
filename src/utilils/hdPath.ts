import {stringToPath} from "@cosmjs/crypto";
import {HdPath} from "../types/hdpath";

export function isHdPathValid({account, change, addressIndex}: HdPath): boolean {
    try {
        stringToPath(`m/44'/853'/${account}'/${change}/${addressIndex}`);
        return true;
    } catch (e) {
        return false;
    }
}