import { ChainInfo, DesmosChains, DesmosClient, Signer } from '@desmoslabs/desmjs';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import appSettingsState from '@recoil/settings';
import { ChainId } from 'types/settings';

/**
 * Interface that represents the global desmos client state.
 */
interface DesmosClientState {
  /**
   * Set the current chain ID.
   */
  setCurrentChainId: (chainId: ChainId) => void;
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

export const DesmosClientProvider: React.FC = (props) => {
  const [appSettings, setAppSettings] = useRecoilState(appSettingsState);
  const { children } = props;

  const [desmosClient, setDesmosClient] = useState<DesmosClient | undefined>();
  // Gets the current chain from the current selected chain id
  const currentChain = useMemo(() => DesmosChains[appSettings.chainId], [appSettings.chainId]);
  if (currentChain === undefined) {
    throw new Error(`Can't find chain with id ${appSettings.chainId}`);
  }

  const [signer, setSigner] = useState<Signer | undefined>();
  const [addresses] = useState<string[] | undefined>(undefined);

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
    async (newChainId: ChainId) => {
      const chainInfo = DesmosChains[newChainId];
      if (chainInfo !== undefined) {
        const newClient = await DesmosClient.connect(chainInfo.rpcUrl);
        if (signer !== undefined) {
          newClient.setSigner(signer);
        }
        setAppSettings(current => ({
          ...current,
          chainId: newChainId,
        }));
        setDesmosClient((old) => {
          if (old) {
            old.disconnect();
          }
          return newClient;
        });
      }
    },
    [signer],
  );

  const providerValue = useMemo(
    () => ({
      currentChain,
      setCurrentChainId: setNewChainId,
      signer,
      addresses,
      desmosClient,
      connectClient,
      setSigner: setNewSigner,
    }),
    [
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
