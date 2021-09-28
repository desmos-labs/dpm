import {useSetRecoilState} from "recoil";
import ChainStore from "../store/ChainStore";
import {useDesmosClient} from "@desmoslabs/sdk-react";
import {useCallback} from "react";

/**
 * Hook that provides a function to fetch the profile associated
 * to the current selected account.
 */
export default function useFetchProfile() {
    const setProfile = useSetRecoilState(ChainStore.userProfile);
    const client = useDesmosClient();

    return useCallback(async (address: string) => {
        await client.connect();
        const profile = await client.getProfile(address);
        setProfile(profile);
    }, [setProfile, client]);
}