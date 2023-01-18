import { ChainConfig } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { SupportedChain } from 'types/chains';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';
import {
  akashIcon,
  bandIcon,
  cosmosIcon,
  cryptoOrgIcon,
  desmosIcon,
  eMoneyIcon,
  junoIcon,
  kavaIcon,
  likecoinIcon,
  osmosisIcon,
  regenIcon,
  terraIcon,
} from 'assets/images';
import {
  BandHdPath,
  CosmosHdPath,
  CroHdPath,
  DesmosHdPath,
  KavaHdPath,
  LunaHdPath,
} from './HdPaths';

export const DesmosChain: SupportedChain = {
  name: 'Desmos',
  prefix: 'desmos',
  masterHDPath: DesmosHdPath,
  icon: desmosIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'desmos',
  }),
  chainInfo: [DesmosTestnet, DesmosMainnet],
};

export const CryptoDotOrgChain: SupportedChain = {
  name: 'Crypto.org',
  prefix: 'cro',
  masterHDPath: CroHdPath,
  icon: cryptoOrgIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'crypto.org',
  }),
};

export const SupportedChains: SupportedChain[] = [
  {
    name: 'Akash',
    prefix: 'akash',
    masterHDPath: CosmosHdPath,
    icon: akashIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'akash',
    }),
  },
  {
    name: 'Band',
    prefix: 'band',
    masterHDPath: BandHdPath,
    icon: bandIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'band',
    }),
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    masterHDPath: CosmosHdPath,
    icon: cosmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos',
    }),
  },
  CryptoDotOrgChain,
  DesmosChain,
  {
    name: 'e-Money',
    prefix: 'emoney',
    masterHDPath: CosmosHdPath,
    icon: eMoneyIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'emoney',
    }),
  },
  {
    name: 'Juno',
    prefix: 'juno',
    masterHDPath: CosmosHdPath,
    icon: junoIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'juno',
    }),
  },
  {
    name: 'Kava',
    prefix: 'kava',
    masterHDPath: KavaHdPath,
    icon: kavaIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'kava',
    }),
  },
  {
    name: 'Likecoin',
    prefix: 'cosmos',
    masterHDPath: CosmosHdPath,
    icon: likecoinIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
  },
  {
    name: 'Osmosis',
    prefix: 'osmo',
    masterHDPath: CosmosHdPath,
    icon: osmosisIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'osmosis',
    }),
  },
  {
    name: 'Regen',
    prefix: 'regen',
    masterHDPath: CosmosHdPath,
    icon: regenIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'regen',
    }),
  },
  {
    name: 'Terra',
    prefix: 'terra',
    masterHDPath: LunaHdPath,
    icon: terraIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'terra',
    }),
  },
];

export default SupportedChains;
