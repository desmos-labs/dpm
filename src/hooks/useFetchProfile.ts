import { useEffect, useState } from 'react';
import { useDesmosClient } from '@desmoslabs/sdk-react';
import ProfileSource from '../sources/ProfileSource';
import { useAppContext } from '../contexts/AppContext';
import { DesmosProfile } from '@desmoslabs/sdk-core';

/**
 * Hook that fetch a profile from the chain and cache it on the device storage.
 * If the application don't have network during the request will be provided a profile
 * fetched from the device storage.
 * @param address - Address of the profile of interest.
 */
export default function useFetchProfile(address: string): DesmosProfile | null {
	const client = useDesmosClient();
	const { profiles, setProfiles } = useAppContext();
	const [profile, setProfile] = useState<DesmosProfile | null>(
		profiles[address] ?? null
	);

	useEffect(() => {
		(async () => {
			try {
				await client.connect();
				const profile = await client.getProfile(address);
				if (profile !== null) {
					const [cached, changed] = await ProfileSource.saveProfile(profile);
					if (changed) {
						setProfiles((old) => {
							const newValue = { ...old };
							newValue[address] = cached;
							return newValue;
						});
						setProfile(cached);
					}
				}
			} catch (e) {
				console.error(e);
			}
		})();
	}, [client, address, setProfile, setProfiles]);

	useEffect(() => {
		setProfile(profiles[address] ?? null);
	}, [profiles, setProfile, address]);

	return profile;
}
