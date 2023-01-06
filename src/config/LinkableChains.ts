import { ChainConfig } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { SupportedChain } from 'types/chains';
import {
  CosmosHdPath,
  BandHdPath,
  CroHdPath,
  KavaHdPath,
  LunaHdPath,
  DesmosHdPath,
} from 'types/chainsHdPaths';

export const DesmosChain: SupportedChain = {
  name: 'Desmos',
  prefix: 'desmos',
  masterHDPath: DesmosHdPath,
  icon: require('../assets/images/chains/desmos.png'),
  chainConfig: ChainConfig.fromPartial({
    name: 'desmos',
  }),
};

export const SupportedChains: SupportedChain[] = [
  {
    name: 'Akash',
    prefix: 'akash',
    masterHDPath: CosmosHdPath,
    icon: require('../assets/images/chains/akash.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'akash',
    }),
  },
  {
    name: 'Band',
    prefix: 'band',
    masterHDPath: BandHdPath,
    icon: require('../assets/images/chains/band.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'band',
    }),
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    masterHDPath: CosmosHdPath,
    icon: require('../assets/images/chains/cosmos.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos',
    }),
  },
  {
    name: 'Crypto.org',
    prefix: 'cro',
    masterHDPath: CroHdPath,
    icon: require('assets/images/chains/cryptoOrg.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'crypto.org',
    }),
  },
  {
    name: 'e-Money',
    prefix: 'emoney',
    masterHDPath: CosmosHdPath,
    icon: require('assets/images/chains/eMoney.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'emoney',
    }),
  },
  {
    name: 'Juno',
    prefix: 'juno',
    masterHDPath: CosmosHdPath,
    icon: require('../assets/images/chains/juno.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'juno',
    }),
  },
  {
    name: 'Kava',
    prefix: 'kava',
    masterHDPath: KavaHdPath,
    icon: require('../assets/images/chains/kava.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'kava',
    }),
  },
  {
    name: 'Likecoin',
    prefix: 'cosmos',
    masterHDPath: CosmosHdPath,
    icon: require('../assets/images/chains/likecoin.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
  },
  {
    name: 'Osmosis',
    prefix: 'osmo',
    masterHDPath: CosmosHdPath,
    icon: require('../assets/images/chains/osmosis.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'osmosis',
    }),
  },
  {
    name: 'Regen',
    prefix: 'regen',
    masterHDPath: CosmosHdPath,
    icon: require('../assets/images/chains/regen.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'regen',
    }),
  },
  {
    name: 'Terra',
    prefix: 'terra',
    masterHDPath: LunaHdPath,
    icon: require('../assets/images/chains/terra.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'terra',
    }),
  },
];

export default SupportedChains;
