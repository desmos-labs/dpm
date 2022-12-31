import { ChainInfo } from '@desmoslabs/desmjs';
import useDesmosClientContext from 'contexts/DesmosClientContext';

export default function useCurrentChainInfo(): ChainInfo {
  const { currentChain } = useDesmosClientContext();
  return currentChain;
}
