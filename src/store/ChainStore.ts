import {atom} from "recoil";
import {StoreKeysEnum} from "./StoreKeysEnum";
import {CachedDesmosProfile} from "../types/chain";

/**
 * Atom that contains all the profiles associated to the
 * accounts presents inside the application.
 */
const profiles = atom<Record<string, CachedDesmosProfile>>({
    key: StoreKeysEnum.profiles,
    default: {}
});

export default {
    profiles,
}