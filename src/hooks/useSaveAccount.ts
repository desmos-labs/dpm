import useRunPromise from "./useRunPromise";
import ChainAccount from "../types/chainAccount";
import AccountSource from "../sources/AccountSource";
import {useRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import Deferred from "../types/defered";

export default function ():
    [Deferred<void> | null, (wallet: ChainAccount) => void] {

    const [value, run] = useRunPromise<void>()
    const [, setAccounts] = useRecoilState(AccountStore.chainAccounts);

    const saveAccount = async (account: ChainAccount) => {

        const task = async () => {
            await AccountSource.putAccount(account);
            setAccounts((accounts) => {
                return [...accounts, account];
            });
        }

        run(task());
    }

    return [value, saveAccount]
}