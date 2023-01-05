import { selectorFamily, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import GetChainLinks from 'services/graphql/queries/GetChainLinks';
import { ChainLink } from 'types/chains';
import useGraphQLClient from 'services/graphql/client';
import { convertGraphQLChainLink } from 'lib/ChainsUtils';

/**
 * Recoil atom for the user's chain links
 */
const chainLinkState = selectorFamily<ChainLink[], string>({
  key: 'chainLink',
  get: (address: string) => async () => {
    const client = useGraphQLClient();
    const { data } = await client.query({
      query: GetChainLinks,
      variables: {
        address,
      },
      fetchPolicy: 'no-cache',
    });

    const { chainLinks } = data;
    return chainLinks.map(convertGraphQLChainLink);
  },
});

export const useChainLinks = (address: string) => {
  const chainLinksSelector = useRecoilValueLoadable<ChainLink[]>(chainLinkState(address));

  const refetchChainLinks = useRecoilRefresher_UNSTABLE(chainLinkState(address));

  const { state, contents } = chainLinksSelector;
  return {
    loading: state === 'loading',
    chainLinks: state === 'hasValue' ? contents : [],
    error: state === 'hasError' ? contents : undefined,
    refetch: refetchChainLinks,
  };
};

export default chainLinkState;
