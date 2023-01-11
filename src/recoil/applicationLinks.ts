import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { ApplicationLink } from 'types/desmos';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * Recoil atom that holds all the application links of all the profiles stored inside the application.
 */
const applicationLinksAppState = atom<Record<string, ApplicationLink[]>>({
  key: 'applicationLinks',
  default: getMMKV(MMKVKEYS.APPLICATION_LINKS) || {},
  effects: [
    ({ onSet }) => {
      onSet((newApplicationLinks) => {
        setMMKV(MMKVKEYS.APPLICATION_LINKS, newApplicationLinks);
      });
    },
  ],
});

/**
 * Hook that allows to easily get the currently stored application links.
 */
export const useStoredApplicationLinks = () => useRecoilValue(applicationLinksAppState);

/**
 * Hook that allows storing a list of application links associated with the same user inside the applications links state.
 */
export const useStoreUserApplicationLinks = () => {
  const setApplicationsLinks = useSetRecoilState(applicationLinksAppState);
  return React.useCallback(
    (user: string, applicationLinks: ApplicationLink[]) => {
      setApplicationsLinks((currentApplicationLinks) => {
        const newApplicationLinks: Record<string, ApplicationLink[]> = {
          ...currentApplicationLinks,
        };
        newApplicationLinks[user] = applicationLinks;
        return newApplicationLinks;
      });
    },
    [setApplicationsLinks],
  );
};
