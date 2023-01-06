import { ChainLink } from 'types/chains';
import { useRecoilValue } from 'recoil';
import { activeAccountAddress } from '@recoil/activeAccountState';

export const useIsCurrentUserLink = (chainLink: ChainLink) => {
  const currentAddress = useRecoilValue(activeAccountAddress);
  return currentAddress === chainLink.userAddress;
};
