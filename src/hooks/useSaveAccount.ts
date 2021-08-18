import useRunPromise from "./useRunPromise";
import ChainAccount from "../types/chainAccount";
import AccountSource from "../sources/AccountSource";
import {useRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import Deferred from "../types/defered";

/**
 * Hooks to save an account into the device storage.
 * Returns a stateful variable that provides the save status and a function to save the account into the device storage.
 */
export default function ():
    [Deferred<void> | null, (wallet: ChainAccount) => void] {

    const [value, run] = useRunPromise<void>()
    const [, setAccounts] = useRecoilState(AccountStore.chainAccounts);

    const saveAccount = async (account: ChainAccount) => {

        run(async () => {
            await AccountSource.putAccount(account);
            setAccounts((accounts) => {
                return [...accounts, account];
            });
        });
    }

    return [value, saveAccount]
}