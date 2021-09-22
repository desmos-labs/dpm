import ChainAccount from "../types/chainAccount";
import AccountSource from "../sources/AccountSource";
import {useSetRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";

/**
 * Hooks to save an account into the device storage.
 * Returns a function to save an account into the device storage.
 */
export default function useSaveAccount() {
    const setAccounts = useSetRecoilState(AccountStore.chainAccounts);

    return async (account: ChainAccount, updateAppState?: boolean) => {
        await AccountSource.putAccount(account);
        if (updateAppState === true) {
            setAccounts((accounts) => {
                return [...accounts, account];
            });
        }
        return account;
    };
}