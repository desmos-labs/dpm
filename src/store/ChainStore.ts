import {atom} from "recoil";
import {StoreKeysEnum} from "./StoreKeysEnum";
import {DesmosProfile} from "@desmoslabs/sdk-core";

/**
 * Atom that should contain the profile associated to the
 * current selected profile.
 */
const userProfile = atom<DesmosProfile | null>({
    key: StoreKeysEnum.useProfile,
    default: null
})

export default {
    userProfile
}