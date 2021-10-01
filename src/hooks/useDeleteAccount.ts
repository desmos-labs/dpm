import {ChainAccount} from "../types/chain";
import {useCallback} from "react";
import AccountSource from "../sources/AccountSource";
import {useRecoilState, useSetRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import ProfileSource from "../sources/ProfileSource";
import ChainStore from "../store/ChainStore";

export default function useDeleteAccount(): (toDelete: ChainAccount) => Promise<ChainAccount[]> {
    const [accounts, setAccounts] = useRecoilState(AccountStore.chainAccounts);
    const setProfiles = useSetRecoilState(ChainStore.profiles);

    return useCallback(async (toDelete: ChainAccount) => {
        let newAccounts = accounts.filter(a => a.address !== toDelete.address);
        setProfiles(old => {
            if (old[toDelete.address] !== undefined) {
                const newProfiles = {...old};
                delete newProfiles[toDelete.address];
                return newProfiles;
            } else {
                return old;
            }
        });
        setAccounts(newAccounts);
        await ProfileSource.deleteProfile(toDelete.address);
        await AccountSource.removeAccount(toDelete);
        return newAccounts;
    }, [accounts, setAccounts, setProfiles]);
}