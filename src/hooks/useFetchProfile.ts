import {useRecoilValue, useSetRecoilState} from "recoil";
import ChainStore from "../store/ChainStore";
import {useDesmosClient} from "@desmoslabs/sdk-react";
import {useCallback} from "react";
import AccountStore from "../store/AccountStore";

/**
 * Hook that provides a function to fetch the profile associated
 * to the current selected account.
 */
export default function useFetchProfile() {
    const setProfile = useSetRecoilState(ChainStore.userProfile);
    const client = useDesmosClient();
    const account = useRecoilValue(AccountStore.selectedAccount)

    return useCallback(async () => {
        if (account !== null) {
            await client.connect();
            const profile = await client.getProfile(account.address);
            setProfile(profile);
        } else {
            setProfile(null);
        }
    }, [setProfile, client, account]);
}