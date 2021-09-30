import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import ChainStore from "../store/ChainStore";
import {useDesmosClient} from "@desmoslabs/sdk-react";
import ProfileSource from "../sources/ProfileSource";
import {CachedDesmosProfile} from "../types/chain";

/**
 * Hook that fetch a profile from the chain and cache it on the device storage.
 * If the application don't have network during the request will be provided a profile
 * fetched from the device storage.
 * @param address - Address of the profile of interest.
 */
export default function useFetchProfile(address: string): CachedDesmosProfile | null {
    const client = useDesmosClient();
    const [profiles, setProfiles] = useRecoilState(ChainStore.profiles);
    const [profile, setProfile] = useState<CachedDesmosProfile | null>(profiles[address] ?? null);

    useEffect(() => {
        (async () => {
            try {
                await client.connect();
                const profile = await client.getProfile(address);
                if (profile !== null) {
                    const [cached, changed] = await ProfileSource.saveProfile(profile);
                    if (changed) {
                        setProfiles(old => {
                            const newValue = {...old};
                            newValue[address] = cached;
                            return newValue;
                        })
                        setProfile(cached);
                    }
                }
            } catch (e) {
                console.error(e);
            }})()
    }, [client, address, setProfile, setProfiles]);

    return profile;
}