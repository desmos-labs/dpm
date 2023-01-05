import { ChainLink } from 'types/chains';
import { useRecoilState } from 'recoil';
import activeAccountState from '@recoil/activeAccountState';

export const useIsCurrentUserLink = (chainLink: ChainLink) => {
  const [currentAddress] = useRecoilState(activeAccountState);
  return currentAddress === chainLink.userAddress;
};
