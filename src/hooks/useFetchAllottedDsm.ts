import { useCallback, useState } from 'react';
import { AirdropApi, Allocation } from '../api/AirdropApi';

/**
 * Hook that provides the amount of DSM that have been allotted to a user.
 */
export default function useFetchAllottedDsm(externalAddress: string) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>();
	const [allottedCoins, setAllottedCoins] = useState(0);
	const [allocations, setAllocations] = useState<Allocation[]>([]);
	const [allClaimed, setAllClaimed] = useState(false);

	const fetchAllocations = useCallback(async () => {
		setLoading(true);
		setError(null);
		setAllocations([]);
		setAllottedCoins(0);
		try {
			const allottedDsm = await AirdropApi.fetchAllottedDsm(externalAddress);
			const notClaimed = allottedDsm.allocations.find(
				(allocation) => !allocation.claimed
			);
			setAllClaimed(notClaimed === undefined);
			setAllottedCoins(allottedDsm.total);
			setAllocations(allottedDsm.allocations);
		} catch (e) {
			setError(e.toString());
		}
		setLoading(false);
	}, [externalAddress]);

	return {
		fetchAllocations,
		loading,
		error,
		allocations,
		allClaimed,
		allottedCoins,
	};
}
