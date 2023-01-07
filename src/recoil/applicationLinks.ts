import { selectorFamily, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import GetConnectedApps from 'services/graphql/queries/GetConnectedApps';
import useGraphQLClient from 'services/graphql/client';
import { ConnectedApp } from 'types/app';

const connectedAppsState = selectorFamily<ConnectedApp[], string>({
  key: 'connectedApps',
  get: (address: string) => async () => {
    const client = useGraphQLClient();
    const { data } = await client.query({
      query: GetConnectedApps,
      variables: {
        address,
      },
      fetchPolicy: 'no-cache',
    });

    return data.application_link;
  },
});

// eslint-disable-next-line import/prefer-default-export
export const useApplicationLinks = (address: string) => {
  const appLinksSelector = useRecoilValueLoadable<ConnectedApp[]>(connectedAppsState(address));

  const refetchAppLinks = useRecoilRefresher_UNSTABLE(connectedAppsState(address));

  const { state, contents } = appLinksSelector;

  return {
    loading: state === 'loading',
    appLinks: state === 'hasValue' ? contents : [],
    error: state === 'hasError' ? contents : undefined,
    refetch: refetchAppLinks,
  };
};
