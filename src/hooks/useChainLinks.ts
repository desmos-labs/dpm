import { useAppContext } from '../contexts/AppContext';

import { ChainLink } from '../types/link';
import { useGetChainLinkByAddress } from '../graphql/types';

export default function useChainLinks(address: string) {
	const { chainLinks, setChainLinks } = useAppContext();
	const userLinks = chainLinks[address];

	useGetChainLinkByAddress({
		variables: {
			address: address,
		},
		onCompleted: ({ chain_link }) => {
			const chainLinks = chain_link.map((link) => {
				return {
					chainName: link.chain_config.name,
					externalAddress: link.external_address,
					userAddress: link.user_address,
					creationTime: new Date(link.creation_time + 'Z'),
				} as ChainLink;
			});
			if (userLinks === undefined) {
				setChainLinks((old) => {
					const newState = {
						...old,
					};
					newState[address] = chainLinks;
					return newState;
				});
			}
		},
		onError: (_) => {
			if (userLinks === undefined) {
				setChainLinks((old) => {
					const newState = {
						...old,
					};
					newState[address] = [];
					return newState;
				});
			}
		},
	});

	return userLinks ?? [];
}
