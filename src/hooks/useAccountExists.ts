import {useCallback} from "react";
import AccountSource from "../sources/AccountSource";

/**
 * Hooks that provides a function to check if an account was previously
 * created from the user.
 */
export default function useAccountExists() {
    return useCallback(async (address: string) => {
        return AccountSource.exist(address);
    }, [])
}