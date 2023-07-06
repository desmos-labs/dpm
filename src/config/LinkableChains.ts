import { ChainConfig } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { SupportedChain } from 'types/chains';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';
import {
  akashIcon,
  bandIcon,
  cosmosIcon,
  cryptoOrgIcon,
  desmosLogoRound,
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

export const AkashChain: SupportedChain = {
  name: 'Akash',
  prefix: 'akash',
  masterHDPath: CosmosHdPath,
  icon: akashIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'akash',
  }),
};

export const BandChain: SupportedChain = {
  name: 'Band',
  prefix: 'band',
  masterHDPath: BandHdPath,
  icon: bandIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'band',
  }),
};

export const CosmosHubChain: SupportedChain = {
  name: 'Cosmos Hub',
  prefix: 'cosmos',
  masterHDPath: CosmosHdPath,
  icon: cosmosIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'cosmos',
  }),
};

export const DesmosChain: SupportedChain = {
  name: 'Desmos',
  prefix: 'desmos',
  masterHDPath: DesmosHdPath,
  icon: desmosLogoRound,
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

export const EMoneyChain: SupportedChain = {
  name: 'e-Money',
  prefix: 'emoney',
  masterHDPath: CosmosHdPath,
  icon: eMoneyIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'emoney',
  }),
};

export const JunoChain: SupportedChain = {
  name: 'Juno',
  prefix: 'juno',
  masterHDPath: CosmosHdPath,
  icon: junoIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'juno',
  }),
};

export const KavaChain: SupportedChain = {
  name: 'Kava',
  prefix: 'kava',
  masterHDPath: KavaHdPath,
  icon: kavaIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'kava',
  }),
};

export const LikeCoinChain: SupportedChain = {
  name: 'Likecoin',
  prefix: 'like',
  masterHDPath: CosmosHdPath,
  icon: likecoinIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'likecoin',
  }),
};

export const OsmosisChain: SupportedChain = {
  name: 'Osmosis',
  prefix: 'osmo',
  masterHDPath: CosmosHdPath,
  icon: osmosisIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'osmosis',
  }),
};

export const RegenChain: SupportedChain = {
  name: 'Regen',
  prefix: 'regen',
  masterHDPath: CosmosHdPath,
  icon: regenIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'regen',
  }),
};

export const TerraChain: SupportedChain = {
  name: 'Terra',
  prefix: 'terra',
  masterHDPath: LunaHdPath,
  icon: terraIcon,
  chainConfig: ChainConfig.fromPartial({
    name: 'terra',
  }),
};

/**
 * List of chains that can be linked to a Desmos profile.
 */
export const LinkableChains: SupportedChain[] = [
  AkashChain,
  BandChain,
  CosmosHubChain,
  CryptoDotOrgChain,
  DesmosChain,
  EMoneyChain,
  JunoChain,
  KavaChain,
  LikeCoinChain,
  OsmosisChain,
  RegenChain,
];

/**
 * List of chains supported from the application.
 */
export const SupportedChains: SupportedChain[] = [...LinkableChains, TerraChain];

export default SupportedChains;
