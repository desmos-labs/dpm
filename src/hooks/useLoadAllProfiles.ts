import {CachedDesmosProfile} from "../types/chain";
import {useCallback} from "react";
import ProfileSource from "../sources/ProfileSource";
import {useSetRecoilState} from "recoil";
import ChainStore from "../store/ChainStore";

/**
 * Hooks that provide a function to load all the profiles cached
 * into the local storage.
 */
export default function useLoadAllProfiles(): () => Promise<CachedDesmosProfile[]> {
    const setProfiles = useSetRecoilState(ChainStore.profiles);

    return useCallback(async () => {
        const profiles = await ProfileSource.getAllProfiles();
        const profilesRecord: Record<string, CachedDesmosProfile> = {};
        profiles.forEach(p => {
            profilesRecord[p.address] = p;
        })
        setProfiles(profilesRecord);
        return profiles
    }, [setProfiles])
}