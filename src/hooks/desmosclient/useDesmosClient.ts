import { DesmosClient } from '@desmoslabs/desmjs';
import { useDesmosClientContext } from '../../contexts/DesmosClientContext';

export default function useDesmosClient(): DesmosClient | undefined {
  const { desmosClient } = useDesmosClientContext();
  return desmosClient;
}
