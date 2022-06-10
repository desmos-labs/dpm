import { useDesmosClientContext } from '../../contexts/DesmosClientContext';

export default function useConnectDesmosClient(): () => Promise<void> {
  const { connectClient } = useDesmosClientContext();
  return connectClient;
}
