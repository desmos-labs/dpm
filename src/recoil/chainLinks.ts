import {
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import GetChainLinks from 'services/graphql/queries/GetChainLinks';
import { ChainLink } from 'types/chains';
import { AppSettings } from 'types/settings';
import appSettingsState from '@recoil/settings';
import buildGraphQlClient from 'services/graphql/client';
import useGraphQLClient from 'services/graphql/client';

/**
 * Format an incoming chain link data from the server into a format that is easier to parse by the app.
 * @param {any[]} chainLinks - An array of chain links data from the server.
 * @returns {ChainLink[]} - An array of formatted ChainLink objects
 */
const formatChainLink = (chainLinks: any[]) =>
  chainLinks.map(
    (link) =>
      ({
        chainLinkName: link.chain_config.name,
        externalAddress: link.external_address,
        userAddress: link.user_address,
        creationTime: new Date(`${link.creation_time}Z`),
      } as ChainLink),
  );

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

    const { chain_link } = data;
    return formatChainLink(chain_link);
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
