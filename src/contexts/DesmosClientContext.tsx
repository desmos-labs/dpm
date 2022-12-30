import { ChainInfo, DesmosChains, DesmosClient, Signer } from '@desmoslabs/desmjs';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Interface that represents the global desmos client state.
 */
interface DesmosClientState {
  /**
   * Record of all the chains informations that can be accessed from the application.
   */
  desmosChains: Record<string, ChainInfo>;
  /**
   * Id of the current chain is use.
   */
  currentChainId: string;
  /**
   * Set the current chain ID.
   */
  setCurrentChainId: (chainId: string) => void;
  /**
   * Current chain informations.
   */
  currentChain: ChainInfo;
  /**
   * The current connected signer.
   */
  signer: Signer | undefined;
  /**
   * Sets the signer that will be used from the DesmosClient.
   * @param signer - Signer that will be used from the DesmosClient.
   */
  setSigner: (signer: Signer) => void;
  /**
   * The addresses of the current connected singer.
   */
  addresses: string[] | undefined;
  /**
   * Current Desmos client.
   */
  desmosClient: DesmosClient | undefined;
  /**
   * Function to initialize and connect a DesmosClient to the current chain.
   */
  connectClient: () => Promise<void>;
}

const initialState: {} = {};
const DesmosClientContext = createContext<DesmosClientState>(initialState as DesmosClientState);

export type Props = {
  /**
   * Id of the chain to use.
   */
  chainId: string;
  /**
   * User defined chains configurations.
   */
  extraChains?: Record<string, ChainInfo>;
};

export const DesmosClientProvider: React.FC<Props> = (props) => {
  const { chainId, extraChains, children } = props;
  // Record of all the chains exposed from the sdk.
  const desmosChains = useMemo(
    () => ({
      ...DesmosChains,
      ...extraChains,
    }),
    [extraChains],
  );

  const [desmosClient, setDesmosClient] = useState<DesmosClient | undefined>();
  // Gets the current chain from the current selected chain id
  const [currentChainId, setCurrentChainId] = useState(chainId);
  const currentChain = desmosChains[currentChainId];
  if (currentChain === undefined) {
    throw new Error(`Can't find chain with id ${currentChainId}`);
  }

  const [signer, setSigner] = useState<Signer | undefined>();
  const [addresses, setAddresses] = useState<string[] | undefined>(undefined);

  const connectClient = useCallback(async () => {
    try {
      const client = await DesmosClient.connect(currentChain.rpcUrl);
      if (signer !== undefined) {
        client.setSigner(signer);
      }
      setDesmosClient((old) => {
        if (old) {
          old.disconnect();
        }
        return client;
      });
    } catch (e) {
      console.error(e);
    }
  }, [currentChain, signer]);

  const setNewSigner = useCallback(
    (newSigner: Signer) => {
      if (desmosClient !== undefined) {
        desmosClient.setSigner(newSigner);
      }
      setSigner(newSigner);
    },
    [desmosClient],
  );

  const setNewChainId = useCallback(
    async (newChainId: string) => {
      const chainInfo = desmosChains[newChainId];
      if (chainInfo !== undefined) {
        const newClient = await DesmosClient.connect(chainInfo.rpcUrl);
        if (signer !== undefined) {
          newClient.setSigner(signer);
        }
        setCurrentChainId(newChainId);
        setDesmosClient((old) => {
          if (old) {
            old.disconnect();
          }
          return newClient;
        });
      }
    },
    [desmosChains, signer],
  );

  const providerValue = useMemo(
    () => ({
      desmosChains,
      currentChainId,
      currentChain,
      setCurrentChainId: setNewChainId,
      signer,
      addresses,
      desmosClient,
      connectClient,
      setSigner: setNewSigner,
    }),
    [
      desmosChains,
      currentChainId,
      currentChain,
      setNewChainId,
      signer,
      addresses,
      desmosClient,
      connectClient,
      setNewSigner,
    ],
  );

  return (
    <DesmosClientContext.Provider value={providerValue}>{children}</DesmosClientContext.Provider>
  );
};

function useDesmosClientContext(): DesmosClientState {
  return useContext(DesmosClientContext);
}

export default useDesmosClientContext;
