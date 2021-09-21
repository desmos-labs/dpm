import {useRecoilValue} from "recoil";
import ChainStore from "../store/ChainStore";

/**
 * Hook that provides the profile associated to
 * the current selected account.
 */
export default function useProfile() {
    return useRecoilValue(ChainStore.userProfile);
}